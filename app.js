require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passportStrategy = require("./controllers/passportStrategy");
const path = require("node:path");
const app = express();
const router = require("./routes/router");
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const store = new (require("connect-pg-simple")(session))({
  pool: require("./db/Pool"),
  createTableIfMissing: true,
});

app.use(
  session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passportStrategy.session());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(port, () => {
  console.log("app running on port " + port);
});
