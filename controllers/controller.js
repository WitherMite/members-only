const pool = require("../db/messagePool");

exports.renderMessages = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM messages");
  res.render("index", { messages: rows });
};

exports.renderMessageByIndex = async (req, res) => {
  // would verify that in is an integer... but not in lesson specs lmao
  const id = ++req.query.n;
  const { rows } = await pool.query("SELECT * FROM messages WHERE id = $1;", [
    id,
  ]);
  res.render("message", rows[0]);
};

exports.renderMessageForm = (req, res) => {
  res.render("form");
};

exports.addMessage = async (req, res) => {
  const message = [req.body.username, req.body.message];
  await pool.query(
    "INSERT INTO messages (username, message) VALUES ($1,$2);",
    message
  );
  res.redirect("/");
};
