const { body } = require("express-validator");
const { getUserByUsername } = require("../db/userQueries");

const checkUsernameUnique = async (val) => {
  const user = await getUserByUsername(val);
  if (user?.id) {
    throw new Error("Username already in use");
  }
};

exports.validateUser = [
  body("username")
    .trim()
    .isAlpha()
    .isLength({ min: 3, max: 15 })
    .withMessage("Username must be between 3 and 15 characters")
    .bail()
    .custom(checkUsernameUnique),
  body("firstname")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .isLength({ max: 15 })
    .withMessage("First name must be less than 15 characters"),
  body("lastname")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .isLength({ max: 15 })
    .withMessage("Last name must be less than 15 characters"),
  body("password")
    .isLength({ min: 6, max: 35 })
    .withMessage("Password must be between 6 and 35 characters"),
  body("confirmPassword")
    .custom((val, { req }) => val === req.body.password)
    .withMessage("Password fields must match"),
];
