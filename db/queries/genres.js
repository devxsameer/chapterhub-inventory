import pool from "../pool.js";

export async function getAllGenresFromDb() {
  const { rows } = await pool.query(
    "SELECT * FROM genres ORDER BY LOWER(name);"
  );
  return rows;
}

export async function getGenreByIdFromDb(genreId) {
  const { rows } = await pool.query("SELECT * FROM genres WHERE id = $1;", [
    genreId,
  ]);
  return rows[0];
}

export async function createGenreInDb(name, description) {
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
    if (err.code === "23505") {
      const conflictErr = new Error("Genre already exists.");
      conflictErr.status = 409;
      throw conflictErr;
    }
    throw err;
  }
}

export async function updateGenreInDb(id, name, description) {
  if (!name || typeof name !== "string") {
    const err = new Error("Genre name is required.");
    err.status = 400;
    throw err;
  }

  try {
    const query = `
      UPDATE genres
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING *;
    `;

    const values = [name.trim(), description?.trim() || null, id];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (err) {
    if (err.code === "23505") {
      const conflictErr = new Error("Genre already exists.");
      conflictErr.status = 409;
      throw conflictErr;
    }
    throw err;
  }
}

export async function deleteGenreFromDb(genreId) {
  const { rows } = await pool.query(
    "DELETE FROM genres WHERE id = $1 RETURNING *;",
    [genreId]
  );
  return rows[0];
}
