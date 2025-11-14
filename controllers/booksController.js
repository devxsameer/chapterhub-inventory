import {
  getAllBooksFromDb,
  getBookByIdFromDb,
  createBookInDb,
  updateBookInDb,
  deleteBookFromDb,
} from "../db/queries/books.js";

import { getAllGenresFromDb } from "../db/queries/genres.js"; // to populate dropdown
import { matchedData, validationResult } from "express-validator";

export async function getBooks(req, res, next) {
  try {
    const books = await getAllBooksFromDb();
    res.render("books", { title: "Books", books });
  } catch (err) {
    next(err);
  }
}

/* CREATE */
export async function createBookGet(req, res, next) {
  try {
    const genres = await getAllGenresFromDb();
    res.render("books_new", {
      title: "Add Book",
      errors: [],
      formData: {},
      genres,
    });
  } catch (err) {
    next(err);
  }
}

export async function createBookPost(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const genres = await getAllGenresFromDb();
    return res.render("books_new", {
      title: "Add Book",
      errors: errors.array(),
      formData: req.body,
      genres,
    });
  }

  try {
    const data = matchedData(req);

    // File uploaded?
    if (req.file) {
      data.image_url = "/uploads/" + req.file.filename;
    }

    await createBookInDb(data);

    res.redirect("/books");
  } catch (err) {
    const genres = await getAllGenresFromDb();

    if (err.status === 409) {
      return res.render("books_new", {
        title: "Add Book",
        errors: [{ msg: err.message }],
        formData: req.body,
        genres,
      });
    }
    next(err);
  }
}

/* UPDATE */
export async function updateBookGet(req, res, next) {
  try {
    const book = await getBookByIdFromDb(req.params.id);
    if (!book) return next(new Error("Book not found."));

    const genres = await getAllGenresFromDb();

    res.render("books_edit", {
      title: "Edit Book",
      errors: [],
      formData: book,
      genres,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateBookPost(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const genres = await getAllGenresFromDb();
    return res.render("books_edit", {
      title: "Edit Book",
      errors: errors.array(),
      formData: req.body,
      genres,
    });
  }

  try {
    const data = matchedData(req);

    // If a new image is uploaded, replace the image_url
    if (req.file) {
      data.image_url = "/uploads/" + req.file.filename;
    }

    await updateBookInDb(req.params.id, data);

    res.redirect("/books");
  } catch (err) {
    const genres = await getAllGenresFromDb();
    if (err.status === 409) {
      return res.render("books_edit", {
        title: "Edit Book",
        errors: [{ msg: err.message }],
        formData: req.body,
        genres,
      });
    }
    next(err);
  }
}

/* DELETE */
export async function deleteBookGet(req, res, next) {
  try {
    const book = await getBookByIdFromDb(req.params.id);
    if (!book) return next(new Error("Book not found."));
    res.render("books_delete", { title: "Delete Book", book });
  } catch (err) {
    next(err);
  }
}

export async function deleteBookPost(req, res, next) {
  try {
    await deleteBookFromDb(req.params.id);
    res.redirect("/books");
  } catch (err) {
    next(err);
  }
}
