const pool = require("../db/messagePool");

exports.createUser = async (username, hashedPassword, firstname, lastname) => {
  await pool.query(
    "INSERT INTO users (username, password, firstname, lastname) VALUES ($1, $2, $3, $4);",
    [username, hashedPassword, firstname, lastname]
  );
};

exports.getUserByUsername = async (username) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE username = $1;",
    [username]
  );
  return rows[0];
};
