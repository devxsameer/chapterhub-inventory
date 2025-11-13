// db/seed.js
import pool from "./pool.js";

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
      UNIQUE(title, author)     -- Avoid duplicates of the same book
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

  const genres = [
    {
      name: "Fiction",
      description: "All fictional narratives and storytelling.",
    },
    {
      name: "Fantasy",
      description: "Worlds of magic, myths, and epic quests.",
    },
    { name: "Horror", description: "Spine-chilling stories meant to scare." },
    {
      name: "Sci-Fi",
      description: "Science fiction and futuristic adventures.",
    },
    { name: "Mystery", description: "Crime, clues, and investigations." },
  ];

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

  const books = [
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      year: 1937,
      genre: "Fantasy",
      description: "A hobbit embarks on an unexpected adventure.",
      image_url: "https://example.com/hobbit.jpg",
      price: 12.99,
      quantity: 8,
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      year: 1965,
      genre: "Sci-Fi",
      description: "A deep and powerful sci-fi epic set on Arrakis.",
      image_url: "https://example.com/dune.jpg",
      price: 15.5,
      quantity: 5,
    },
    {
      title: "It",
      author: "Stephen King",
      year: 1986,
      genre: "Horror",
      description: "A group of children face an ancient evil.",
      image_url: "https://example.com/it.jpg",
      price: 10.99,
      quantity: 4,
    },
    {
      title: "Sherlock Holmes: A Study in Scarlet",
      author: "Arthur Conan Doyle",
      year: 1887,
      genre: "Mystery",
      description: "The first Sherlock Holmes detective story.",
      image_url: "https://example.com/sherlock.jpg",
      price: 9.5,
      quantity: 6,
    },
  ];

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
