#! /usr/bin/env node
const { Client } = require("pg");
const fs = require("fs");
const connectionURI = process.argv[2];
const caPath = process.argv[3];
const ca = caPath ? fs.readFileSync(caPath).toString() : false;

const SQL = `
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT,
  password TEXT,
  firstname TEXT,
  lastname TEXT,
  is_member BOOL DEFAULT FALSE,
  is_admin BOOL DEFAULT FALSE
);

INSERT INTO users (username, password, firstname, lastname, is_member, is_admin) VALUES ('example@server.com', '$2b$10$p1EldfZLqHUYO6YjYnAhpubPoydZud9YMWJrn/jKqAkl2cIh9qsie', 'Server', '', TRUE, TRUE);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER,
  title TEXT,
  message TEXT,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (user_id, title, message) VALUES (1, 'Welcome!', 'Hello, this is a members only message board!');
`;

async function main() {
  console.log("seeding...");
  const config = ca
    ? {
        connectionString: connectionURI,
        ssl: {
          rejectUnauthorized: true,
          ca,
        },
      }
    : { connectionString: connectionURI };
  const client = new Client(config);
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
