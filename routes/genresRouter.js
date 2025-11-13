import { Router } from "express";

const genresRouter = Router();

genresRouter.route("/").get((req, res) => {
  res.render("genres", { title: "All Genres" });
});

export default genresRouter;
