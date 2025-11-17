import pool from "../pool.js";

// /* List all books (with genre name) */
// export async function getAllBooksFromDb() {
//   const { rows } = await pool.query(`
//     SELECT b.*, g.name AS genre_name
//     FROM books b
//     LEFT JOIN genres g ON b.genre_id = g.id
//     ORDER BY LOWER(b.title);
//   `);
//   return rows;
// }

export async function getFilteredBooksFromDb({ search, genres, sort }) {
  let whereClauses = [];
  let values = [];
  let orderBy = "ORDER BY LOWER(b.title) ASC";

  // 🔍 Search
  if (search) {
    values.push(`%${search}%`);
    whereClauses.push(`LOWER(b.title) LIKE LOWER($${values.length})`);
  }

  // 🎭 Genre multi-select
  if (genres.length > 0) {
    const placeholders = genres
      .map((g, index) => "$" + (values.length + index + 1))
      .join(",");

    values.push(...genres);
    whereClauses.push(`b.genre_id IN (${placeholders})`);
  }

  // 🔽 Sorting
  switch (sort) {
    case "title_asc":
      orderBy = "ORDER BY LOWER(b.title) ASC";
      break;
    case "title_desc":
      orderBy = "ORDER BY LOWER(b.title) DESC";
      break;
    case "year_asc":
      orderBy = "ORDER BY b.year ASC NULLS LAST";
      break;
    case "year_desc":
      orderBy = "ORDER BY b.year DESC NULLS LAST";
      break;
    case "price_asc":
      orderBy = "ORDER BY b.price ASC";
      break;
    case "price_desc":
      orderBy = "ORDER BY b.price DESC";
      break;
  }

  let sql = `
    SELECT b.*, g.name AS genre_name
    FROM books b
    LEFT JOIN genres g ON b.genre_id = g.id
  `;

  if (whereClauses.length > 0) {
    sql += " WHERE " + whereClauses.join(" AND ");
  }

  sql += ` ${orderBy};`;

  const { rows } = await pool.query(sql, values);
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

export async function updateBookInDb(id, data) {
  if (!data.title || typeof data.title !== "string") {
    const err = new Error("Book title is required.");
    err.status = 400;
    throw err;
  }

  try {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${i++}`);
      values.push(typeof value === "string" ? value.trim() : value);
    }

    values.push(id);

    const query = `
      UPDATE books
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING *;
    `;

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
