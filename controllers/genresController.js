import {
  createGenreInDb,
  getAllGenresFromDb,
  getGenreFromDb,
} from "../db/queries/genres.js";
import { matchedData, validationResult } from "express-validator";

async function getGenres(req, res, next) {
  try {
    const genres = await getAllGenresFromDb();

    res.render("genres", {
      title: "All Genres",
      genres,
    });
  } catch (err) {
    next(err);
  }
}
async function getGenre(req, res, next) {
  const { genreId } = req.params;
  try {
    const genre = await getGenreFromDb(genreId);

    res.render("genre", {
      title: genre.name,
      genre,
    });
  } catch (err) {
    next(err);
  }
}
async function createGenreGet(req, res) {
  res.render("newGenre");
}
async function createGenrePost(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array()[0].msg;

    return res.status(400).render("error", {
      title: "Validation Error",
      code: 400,
      message: msg,
      details: null,
    });
  }
  try {
    const { name, description } = matchedData(req);

    const genre = await createGenreInDb(name, description);
    console.log(genre);

    res.redirect("/genres");
  } catch (err) {
    next(err); // goes to your custom error handler
  }
}
export { getGenres, createGenrePost, createGenreGet, getGenre };
