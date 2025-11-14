// db/seed.js
import pool from "./pool.js";
import genres from "./data/genres.js";
import books from "./data/books.js";

//
// ────────────────────────────────────────────────────────────────
//   SCHEMA (TABLES)
// ────────────────────────────────────────────────────────────────
//

async function resetTables() {
  console.log("\n🧨 Dropping tables...");

  await pool.query(`
    DROP TABLE IF EXISTS books;
    DROP TABLE IF EXISTS genres;
  `);

  console.log("   → Tables dropped");
}

async function createTables() {
  console.log("\n🔧 Creating tables...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS genres (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255),
      description TEXT,
      year INTEGER,
      genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
      image_url TEXT,
      price NUMERIC(10,2) DEFAULT 0.00,
      quantity INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(title, author)
    );
  `);

  console.log("   → Tables created ✔");
}

//
// ────────────────────────────────────────────────────────────────
//   GENRE SEEDING
// ────────────────────────────────────────────────────────────────
//

async function seedGenres() {
  console.log("\n🌱 Seeding genres...");

  for (const g of genres) {
    await pool.query(
      `
      INSERT INTO genres (name, description)
      VALUES ($1, $2)
      ON CONFLICT (name) DO NOTHING;
      `,
      [g.name, g.description]
    );
    console.log(`   → Ensured genre: ${g.name}`);
  }
}

//
// ────────────────────────────────────────────────────────────────
//   BOOK SEEDING
// ────────────────────────────────────────────────────────────────
//

async function seedBooks() {
  console.log("\n📚 Seeding books...");

  for (const b of books) {
    await pool.query(
      `
      INSERT INTO books (title, author, description, year, genre_id, image_url, price, quantity)
      SELECT $1, $2, $3, $4, g.id, $6, $7, $8
      FROM genres g
      WHERE g.name = $5
      ON CONFLICT (title, author) DO NOTHING;
      `,
      [
        b.title,
        b.author,
        b.description,
        b.year,
        b.genre,
        b.image_url,
        b.price,
        b.quantity,
      ]
    );
    console.log(`   → Ensured book: ${b.title}`);
  }
}

//
// ────────────────────────────────────────────────────────────────
//   MAIN EXECUTION
// ────────────────────────────────────────────────────────────────
//

async function main() {
  console.log("🚀 Starting database seed...");

  try {
    if (process.argv.includes("--reset")) {
      await resetTables();
    }

    await createTables();
    await seedGenres();
    await seedBooks();

    console.log("\n✨ Database successfully seeded!");
  } catch (err) {
    console.error("\n❌ Seed failed!");
    console.error(err);
  } finally {
    await pool.end();
    console.log("\n🔌 Connection closed.\n");
    process.exit(0);
  }
}

main();
