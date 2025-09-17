const bcrypt = require("bcryptjs");
const userDB = require("../db/userQueries");
const messageDB = require("../db/messageQueries");

// renderers

exports.viewIndex = async (req, res) => {
  const messages = await messageDB.readAllFull();
  res.render("index", { messages });
};

exports.viewSignupForm = async (req, res) => {
  res.render("signup-form");
};

// CRUD

exports.addUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await userDB.createUser(
      req.body.username,
      hashedPassword,
      req.body.firstname,
      req.body.lastname
    );
    res.redirect("/");
  } catch (e) {
    console.error(e);
    next(e);
  }
};
