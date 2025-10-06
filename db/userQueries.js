const pool = require("./Pool");

exports.createUser = async (username, hashedPassword) => {
  const { rows } = await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;",
    [username, hashedPassword]
  );
  return rows[0];
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

exports.makeUserMember = async (id) => {
  return await pool.query("UPDATE users SET is_member = true WHERE id = $1", [
    id,
  ]);
};

exports.makeUserAdmin = async (id) => {
  return await pool.query("UPDATE users SET is_admin = true WHERE id = $1", [
    id,
  ]);
};
