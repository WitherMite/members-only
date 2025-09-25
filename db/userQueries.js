const pool = require("./Pool");

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

exports.getUserById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
  return rows[0];
};
