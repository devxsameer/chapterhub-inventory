import { getAllGenresFromDb } from "../db/queries/genres.js";

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

export { getGenres };
