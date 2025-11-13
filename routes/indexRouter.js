import { Router } from "express";

const indexRouter = Router();

indexRouter.route("/").get((req, res) => {
  res.render("index", { title: "ChapterHub Inventory" });
});

export default indexRouter;
