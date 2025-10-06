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

exports.viewMessageForm = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("message-form");
  }
  res.redirect("/");
};

exports.viewMemberForm = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("member-form", { wasFailure: req.query.f });
  }
  res.redirect("/");
};

exports.viewAdminForm = async (req, res) => {
  if (req.isAuthenticated() && req.user.is_member) {
    return res.render("admin-form", { wasFailure: req.query.f });
  }
  res.redirect("/");
};

// CRUD

exports.addUser = [
  validators.validateUser,
  async (req, res, next) => {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup-form", {
        username,
        errorList: errors.array(),
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userDB.createUser(username, hashedPassword);
      req.login(user, (e) => {
        if (e) return next(e);
        return res.redirect("/");
      });
    } catch (e) {
      console.error(e);
      return next(e);
    }
  },
];

exports.newMessage = [
  validators.validateMessage,
  async (req, res) => {
    const errors = validationResult(req);
    const { title, message } = req.body;
    if (!req.isAuthenticated()) {
      // wouldnt happen through the website, but could still send a POST without the form i guess
      const errorList = errors.array();
      errorList.push({ msg: "You are not logged in." });
      return res.status(400).render("message-form", {
        title,
        message,
        errorList,
      });
    }

    if (!errors.isEmpty()) {
      console.table(errors.array());
      return res.status(400).render("message-form", {
        title,
        message,
        errorList: errors.array(),
      });
    }

    await messageDB.createMessage(req.user.id, title, message);
    res.redirect("/");
  },
];

exports.deleteMessage = async (req, res) => {
  const { id } = req.body;
  if (id && req.isAuthenticated() && req.user.is_admin) {
    await messageDB.deleteMessage(id);
  }
  res.redirect("/");
};

exports.makeUserMember = async (req, res) => {
  const { password } = req.body;
  if (req.isAuthenticated() && password === process.env.MEMBER_PW) {
    await userDB.makeUserMember(req.user.id);
    return res.redirect("/");
  }
  res.redirect("/member-form?f=1");
};

exports.makeUserAdmin = async (req, res) => {
  const { password } = req.body;
  if (
    req.isAuthenticated() &&
    req.user.is_member &&
    password === process.env.ADMIN_PW
  ) {
    await userDB.makeUserAdmin(req.user.id);
    return res.redirect("/");
  }
  res.redirect("/admin-form?f=1");
};
