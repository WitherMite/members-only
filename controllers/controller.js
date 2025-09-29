const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const userDB = require("../db/userQueries");
const messageDB = require("../db/messageQueries");
const passportStrategy = require("./passportStrategy");
const validators = require("./validators");

// Authentication

exports.loginUser = passportStrategy.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login?f=1",
});

exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

// Renderers

exports.viewIndex = async (req, res) => {
  const user = req.user;
  if (!user) {
    const messages = await messageDB.readAllAnon();
    return res.render("index", { messages });
  }
  if (user.is_member) {
    const messages = await messageDB.readAllFull();
    return res.render("index", { messages, user });
  }
  const messages = await messageDB.readAllAnon();
  return res.render("index", { messages, user });
};

exports.viewSignupForm = async (req, res) => {
  res.render("signup-form");
};

exports.viewLoginForm = async (req, res) => {
  res.render("login-form", { wasFailure: req.query.f });
};

exports.viewMemberForm = async (req, res) => {
  res.render("member-form");
}; // protect this route

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

exports.makeUserMember = async (req, res) => {}; // protect this route
