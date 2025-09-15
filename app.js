require("dotenv").config();
const express = require("express");
const path = require("node:path");
const app = express();
const router = require("./routes/router");
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(port, () => {
  console.log("app running on port " + port);
});
