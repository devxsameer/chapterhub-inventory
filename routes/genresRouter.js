import { Router } from "express";
import {
  createGenreGet,
  createGenrePost,
  getGenres,
} from "../controllers/genresController.js";
import { createGenreValidator } from "../validators/genresValidators.js";

const genresRouter = Router();

genresRouter.get("/", getGenres);
genresRouter
  .route("/new")
  .get(createGenreGet)
  .post(createGenreValidator, createGenrePost);

export default genresRouter;
