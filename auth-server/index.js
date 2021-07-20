const express = require("express");
const cors = require("cors");


// express app set up
const app = express();
app.use(express.json());
app.use(cors());


// connecting to postgres
const { Pool } = require("pg");
const pgClient = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS users (number INT)")
    .catch((err) => console.error(err));
});


/*======= ROUTES =======*/

// GET routes
app.get("/", async (req, res) => {
    try{
        res.status(201).send({"success": true});
    }
    catch (err){
        res.status(400).send(err);
    }

});


app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





