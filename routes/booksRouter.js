import { Router } from "express";
import {
  getBooks,
  createBookGet,
  createBookPost,
  updateBookGet,
  updateBookPost,
  deleteBookGet,
  deleteBookPost,
} from "../controllers/booksController.js";

import { bookValidator } from "../validators/booksValidators.js";
import upload from "../middlewares/upload.js"; // <-- NEW

const booksRouter = Router();

// CREATE
booksRouter.route("/new").get(createBookGet).post(
  upload.single("image"), // <-- multer
  bookValidator,
  createBookPost
);

// UPDATE
booksRouter.route("/:id/edit").get(updateBookGet).post(
  upload.single("image"), // <-- multer
  bookValidator,
  updateBookPost
);

// DELETE
booksRouter.route("/:id/delete").get(deleteBookGet).post(deleteBookPost);

booksRouter.get("/", getBooks);

export default booksRouter;
