const pool = require("./Pool");
const protectedMessages = [1];

exports.createMessage = async (userId, title, message) => {
  await pool.query(
    "INSERT INTO messages (user_id, title, message) VALUES ($1, $2, $3);",
    [userId, title, message]
  );
};

exports.deleteMessage = async (id) => {
  if (protectedMessages.includes(Number(id)))
    throw new Error("That message cannot be deleted");
  await pool.query("DELETE FROM messages WHERE id = $1;", [id]);
};

exports.readAllFull = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM messages AS m JOIN (SELECT id AS user_id, username FROM users) AS u ON m.user_id = u.user_id;"
  );
  return rows;
};

exports.readAllAnon = async () => {
  const { rows } = await pool.query("SELECT * FROM messages;");
  return rows;
};
