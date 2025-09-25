const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const userDB = require("../db/userQueries");
const bcrypt = require("bcryptjs");

passport.use(
  new localStrategy(async (username, password, callback) => {
    try {
      const user = await userDB.getUserByUsername(username);

      if (!user) {
        return callback(null, false, { message: "Incorrect username." });
      }

      if (!bcrypt.compare(password, user.password)) {
        return callback(null, false, { message: "Incorrect password." });
      }

      return callback(null, user);
    } catch (e) {
      return callback(e);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userDB.getUserById(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
