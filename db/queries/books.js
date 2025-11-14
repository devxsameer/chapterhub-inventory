import pool from "../pool.js";

/* List all books (with genre name) */
export async function getAllBooksFromDb() {
  const { rows } = await pool.query(`
    SELECT b.*, g.name AS genre_name
    FROM books b
    LEFT JOIN genres g ON b.genre_id = g.id
    ORDER BY LOWER(b.title);
  `);
  return rows;
}

/* Single book by id */
export async function getBookByIdFromDb(bookId) {
  const { rows } = await pool.query(
    `
    SELECT b.*, g.name AS genre_name
    FROM books b
    LEFT JOIN genres g ON b.genre_id = g.id
    WHERE b.id = $1;
  `,
    [bookId]
  );
  return rows[0];
}

/* Create book */
export async function createBookInDb({
  title,
  author,
  description,
  year,
  genre_id,
  image_url,
  price,
  quantity,
}) {
  if (!title || typeof title !== "string") {
    const err = new Error("Book title is required.");
    err.status = 400;
    throw err;
  }

  try {
    const query = `
      INSERT INTO books
        (title, author, description, year, genre_id, image_url, price, quantity)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;
    const values = [
      title.trim(),
      author?.trim() || null,
      description?.trim() || null,
      year ? Number(year) : null,
      genre_id ? Number(genre_id) : null,
      image_url?.trim() || null,
      price ? Number(price) : 0.0,
      quantity ? Number(quantity) : 0,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (err) {
    if (err.code === "23505") {
      const conflictErr = new Error(
        "A book with that title and author already exists."
      );
      conflictErr.status = 409;
      throw conflictErr;
    }
    throw err;
  }
}

/* Update book */
export async function updateBookInDb(
  id,
  { title, author, description, year, genre_id, image_url, price, quantity }
) {
  if (!title || typeof title !== "string") {
    const err = new Error("Book title is required.");
    err.status = 400;
    throw err;
  }

  try {
    const query = `
      UPDATE books
      SET title = $1,
          author = $2,
          description = $3,
          year = $4,
          genre_id = $5,
          image_url = $6,
          price = $7,
          quantity = $8
      WHERE id = $9
      RETURNING *;
    `;
    const values = [
      title.trim(),
      author?.trim() || null,
      description?.trim() || null,
      year ? Number(year) : null,
      genre_id ? Number(genre_id) : null,
      image_url?.trim() || null,
      price ? Number(price) : 0.0,
      quantity ? Number(quantity) : 0,
      id,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (err) {
    if (err.code === "23505") {
      const conflictErr = new Error(
        "A book with that title and author already exists."
      );
      conflictErr.status = 409;
      throw conflictErr;
    }
    throw err;
  }
}

/* Delete book */
export async function deleteBookFromDb(bookId) {
  const { rows } = await pool.query(
    "DELETE FROM books WHERE id = $1 RETURNING *;",
    [bookId]
  );
  return rows[0];
}
