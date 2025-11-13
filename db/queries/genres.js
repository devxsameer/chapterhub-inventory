import pool from "../pool.js";

async function getAllGenresFromDb() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY name;");
  return rows;
}

export { getAllGenresFromDb };
