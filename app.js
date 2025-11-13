// app.js
import "dotenv/config";

import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";

import setLocals from "./middlewares/setLocals.js";

import indexRouter from "./routes/indexRouter.js";
import genresRouter from "./routes/genresRouter.js";
import booksRouter from "./routes/booksRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(setLocals);

app.use("/", indexRouter);
app.use("/genres", genresRouter);
app.use("/books", booksRouter);

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    code: 404,
    message: "Page not found.",
    url: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).render("error", {
    title: "Server Error",
    code: 500,
    message: "Something went wrong on our side.",
    details: err.message || err,
  });
});

const PORT = process.env.PORT || 6969;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
