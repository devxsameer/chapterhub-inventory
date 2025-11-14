import pool from "../pool.js";

async function getAllGenresFromDb() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY name;");
  return rows;
}
async function getGenreFromDb(genreId) {
  const { rows } = await pool.query("SELECT * FROM genres WHERE id = $1;", [
    genreId,
  ]);
  return rows[0];
}

async function createGenreInDb(name, description) {
  if (!name || typeof name !== "string") {
    const err = new Error("Genre name is required.");
    err.status = 400;
    throw err;
  }

  try {
    const query = `
      INSERT INTO genres (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [name.trim(), description?.trim() || null];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (err) {
    // PostgreSQL unique constraint error for "name"
    if (err.code === "23505") {
      const conflictErr = new Error("Genre already exists.");
      conflictErr.status = 409; // conflict
      throw conflictErr;
    }

    // Re-throw unknown DB errors
    throw err;
  }
}

export { getAllGenresFromDb, createGenreInDb, getGenreFromDb };
