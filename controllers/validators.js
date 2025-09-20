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
    .bail()
    .custom(checkUsernameUnique),
  body("firstname")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .isLength({ max: 15 }),
  body("lastname")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .isLength({ max: 15 }),
  body("password").isLength({ min: 6, max: 35 }),
  body("confirmPassword").custom((val, { req }) => val === req.body.password),
];
