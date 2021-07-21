const express = require("express");
const cors = require("cors");


// express app set up
const app = express();
app.use(express.json());
app.use(cors());


// connecting to postgres


// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pgClient.on("connect", (client) => {
    console.log("connected to db");
  client
    .query("CREATE TABLE IF NOT EXISTS orders (number INT)")
    .catch((err) => console.error(err));
});


/*======= ROUTES =======*/

// GET routes
app.get("/", async (req, res) => {
    try{
        const orders = await pgClient.query("SELECT * from orders");
        res.status(201).send(orders.rows);
    }
    catch (err){
        res.status(400).send(err);
    }

});

app.post("/", async (req, res) => {
    console.log("posting");
    await pgClient.query("INSERT INTO orders(number) VALUES($1)", [5]);

    res.send({ working: true });
});


app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





