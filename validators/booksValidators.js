import { body } from "express-validator";

export const bookValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 255 })
    .withMessage("Title cannot exceed 255 characters."),

  body("author")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Author cannot exceed 255 characters."),

  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description too long."),

  body("year")
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 9999 })
    .withMessage("Year must be a valid integer."),

  body("genre_id")
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage("Invalid genre selection."),

  body("image_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Image URL must be a valid URL."),

  body("price")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("quantity")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer."),
];
