const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const userDB = require("../db/userQueries");
const messageDB = require("../db/messageQueries");
const passportStrategy = require("./passportStrategy");
const validators = require("./validators");

// Authentication

exports.loginUser = (req, res) => {
  passportStrategy.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}; // find a way to give user error feedback

// Renderers

exports.viewIndex = async (req, res) => {
  const messages = await messageDB.readAllFull();
  res.render("index", { messages });
};

exports.viewSignupForm = async (req, res) => {
  res.render("signup-form");
};

exports.viewLoginForm = async (req, res) => {
  res.render("login-form");
};

exports.viewMemberForm = async (req, res) => {
  res.render("member-form");
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

exports.makeUserMember = async (req, res) => {};
