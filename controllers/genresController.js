import {
  createGenreInDb,
  deleteGenreFromDb,
  getAllGenresFromDb,
  getGenreByIdFromDb,
  updateGenreInDb,
} from "../db/queries/genres.js";
import { matchedData, validationResult } from "express-validator";

export async function getGenres(req, res, next) {
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

/* CREATE */
export function createGenreGet(req, res) {
  res.render("genres_new", {
    title: "Add Genre",
    errors: [],
    formData: {},
  });
}

export async function createGenrePost(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("genres_new", {
      title: "Add Genre",
      errors: errors.array(),
      formData: req.body,
    });
  }

  try {
    const { name, description } = matchedData(req);
    await createGenreInDb(name, description);

    res.redirect("/genres");
  } catch (err) {
    if (err.status === 409) {
      return res.render("genres_new", {
        title: "Add Genre",
        errors: [{ msg: err.message }],
        formData: req.body,
      });
    }
    next(err);
  }
}

/* UPDATE */
export async function updateGenreGet(req, res, next) {
  try {
    const genre = await getGenreByIdFromDb(req.params.id);

    if (!genre)
      return res.status(404).render("error", {
        title: "Genre Not Found",
        code: 404,
        message: "Genre not found.",
        url: req.originalUrl,
      });

    res.render("genres_edit", {
      title: "Edit Genre",
      errors: [],
      formData: genre,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateGenrePost(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("genres_edit", {
      title: "Edit Genre",
      errors: errors.array(),
      formData: req.body,
    });
  }

  try {
    const { name, description } = matchedData(req);

    await updateGenreInDb(req.params.id, name, description);

    res.redirect("/genres");
  } catch (err) {
    if (err.status === 409) {
      return res.render("genres_edit", {
        title: "Edit Genre",
        errors: [{ msg: err.message }],
        formData: req.body,
      });
    }
    next(err);
  }
}

/* DELETE */
export async function deleteGenreGet(req, res, next) {
  try {
    const genre = await getGenreByIdFromDb(req.params.id);

    if (!genre)
      return res.status(404).render("error", {
        title: "Genre Not Found",
        code: 404,
        message: "Genre not found.",
        url: req.originalUrl,
      });

    res.render("genres_delete", {
      title: "Delete Genre",
      genre,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteGenrePost(req, res, next) {
  try {
    await deleteGenreFromDb(req.params.id);
    res.redirect("/genres");
  } catch (err) {
    next(err);
  }
}
