import { Router } from "express";
import {
  getGenres,
  createGenreGet,
  createGenrePost,
  updateGenreGet,
  updateGenrePost,
  deleteGenrePost,
  deleteGenreGet,
} from "../controllers/genresController.js";
import { genreValidator } from "../validators/genresValidators.js";

const genresRouter = Router();

genresRouter.get("/", getGenres);

// CREATE
genresRouter
  .route("/new")
  .get(createGenreGet)
  .post(genreValidator, createGenrePost);

// UPDATE
genresRouter
  .route("/:id/edit")
  .get(updateGenreGet)
  .post(genreValidator, updateGenrePost);

// DELETE
genresRouter.route("/:id/delete").get(deleteGenreGet).post(deleteGenrePost);

export default genresRouter;
