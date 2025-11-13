// db/seed.js
import pool from "./pool.js";

async function createTables() {
  console.log("\n🔧 Setting up database tables...");

  const query = `
    CREATE TABLE IF NOT EXISTS genres (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255),
      year INTEGER,
      genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL
    );
  `;

  await pool.query(query);
  console.log("   → Tables ready ✔");
}

async function seedGenres() {
  console.log("\n🌱 Seeding genres...");

  const genres = ["Fiction", "Fantasy", "Horror", "Sci-Fi"];

  for (const name of genres) {
    await pool.query(
      `INSERT INTO genres (name)
       VALUES ($1)
       ON CONFLICT (name) DO NOTHING`,
      [name]
    );
    console.log(`   → Ensured genre: ${name}`);
  }
}

async function seedBooks() {
  console.log("\n📚 Seeding sample books...");

  await pool.query(
    `INSERT INTO books (title, author, year, genre_id)
     SELECT $1, $2, $3, g.id 
     FROM genres g 
     WHERE g.name = $4
     ON CONFLICT DO NOTHING`,
    ["The Hobbit", "J.R.R. Tolkien", 1937, "Fantasy"]
  );

  console.log("   → Sample book added (or already exists)");
}

async function main() {
  console.log("🚀 Starting database seed...");

  try {
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
