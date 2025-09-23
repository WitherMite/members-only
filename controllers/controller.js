const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const userDB = require("../db/userQueries");
const messageDB = require("../db/messageQueries");
const validators = require("./validators");

// renderers

exports.viewIndex = async (req, res) => {
  const messages = await messageDB.readAllFull();
  res.render("index", { messages });
};

exports.viewSignupForm = async (req, res) => {
  res.render("signup-form");
};

// CRUD

exports.addUser = [
  validators.validateUser,
  async (req, res, next) => {
    const { username, password, firstname, lastname } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.table(errors.array());
      return res.status(400).render("signup-form", {
        username,
        firstname,
        lastname,
        errorList: errors.array(),
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await userDB.createUser(username, hashedPassword, firstname, lastname);
      res.redirect("/");
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
];
