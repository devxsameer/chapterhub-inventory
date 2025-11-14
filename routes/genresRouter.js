import { Router } from "express";
import {
  createGenreGet,
  createGenrePost,
  getGenres,
  getGenre
} from "../controllers/genresController.js";
import { createGenreValidator } from "../validators/genresValidators.js";

const genresRouter = Router();

genresRouter.get("/", getGenres);
genresRouter
  .route("/new")
  .get(createGenreGet)
  .post(createGenreValidator, createGenrePost);
genresRouter.get("/:genreId",getGenre)
export default genresRouter;
