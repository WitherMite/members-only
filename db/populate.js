#! /usr/bin/env node
const { Client } = require("pg");
const fs = require("fs");
const connectionURI = process.argv[2];
const caPath = process.argv[3];
const ca = caPath ? fs.readFileSync(caPath).toString() : false;

const SQL = `
DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT,
  message TEXT,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (username, message) 
VALUES (
  'Server',
  'Hi there, this is a simple message board!'
);
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
