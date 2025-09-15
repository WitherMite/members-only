const pool = require("../db/messagePool");

exports.renderMessages = async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM messages AS m JOIN (SELECT id AS user_id, username FROM users) AS u on m.user_id = u.user_id;"
  );
  res.render("index", { messages: rows });
};

exports.renderMessageByIndex = async (req, res) => {
  // possibly unneeded
  const id = ++req.query.n;
  const { rows } = await pool.query(
    "SELECT * FROM messages AS m JOIN (SELECT id AS user_id, username FROM users) AS u on m.user_id = u.user_id WHERE id = $1;",
    [id]
  );
  res.render("message", rows[0]);
};

exports.renderMessageForm = (req, res) => {
  res.render("form");
};

// exports.addMessage = async (req, res) => {
//   const message = [req.body.username, req.body.message];
//   await pool.query(
//     "INSERT INTO messages (username, message) VALUES ($1,$2);",
//     message
//   );
//   res.redirect("/");
// };
