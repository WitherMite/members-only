const pool = require("./Pool");

exports.createMessage = async (userId, title, message) => {
  await pool.query(
    "INSERT INTO messages (user_id, title, message) VALUES ($1, $2, $3);",
    [userId, title, message]
  );
};

exports.readAllFull = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM messages AS m JOIN (SELECT id AS user_id, username, firstname, lastname FROM users) AS u ON m.user_id = u.user_id;"
  );
  return rows;
};

exports.readAllAnon = async () => {
  const { rows } = await pool.query("SELECT * FROM messages;");
  return rows;
};

exports.readByIdFull = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM messages AS m JOIN (SELECT id AS user_id, username, firstname, lastname FROM users) AS u ON m.user_id = u.user_id WHERE id = $1;",
    [id]
  );
  return rows;
};
