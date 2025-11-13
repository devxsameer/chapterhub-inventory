import { Router } from "express";

const booksRouter = Router();

booksRouter.route("/").get((req, res) => {
  res.render("books", { title: "Books" });
});

export default booksRouter;
