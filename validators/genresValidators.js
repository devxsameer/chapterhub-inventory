import { body } from "express-validator";

export const genreValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description too long."),
];
