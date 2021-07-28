// configuring a client to connect to postgres
const { Pool } = require("pg");
const pgClient = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});



module.exports = pgClient;


