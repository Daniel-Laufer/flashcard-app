const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// bcrypt setup
const bcrypt = require('bcrypt');
const bcrypt_salt_rounds = 10;



// express app set up
const app = express();
app.use(express.json());
app.use(cors());


// configuring a client to connect to postgres
const { Pool } = require("pg");
const pgClient = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pgClient.on("connect", () => {
    console.log("client onnected to postgres db.")
});


/*======= ROUTES =======*/

app.post("/register", async (req, res) => {
    const user_validation_schema = Joi.object({
        password: Joi.string().min(5).required(),
        email: Joi.string().required().email(),
    });

    const {error} = user_validation_schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // deconstructing the request body
    const {password, email} = req.body;

    // hashing password. Good explanation of bcrypt here: https://www.reddit.com/r/javascript/comments/9xdri9/how_does_bcrypt_work_it_feels_like_magic/e9rsazc?utm_source=share&utm_medium=web2x&context=3
    const hashed_password = await bcrypt.hash(password, bcrypt_salt_rounds);

    // add user to database
    const text = 'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *'
    const values = [hashed_password, email];

    let new_user;
    pgClient.query(text, values, (pg_err, pg_res) => {
        if (pg_err){
            console.log(pg_err.stack);
            return res.status(500).send(pg_err);
        }
        new_user = pg_res.rows[0];

        // create and return a jwt auth token for this user
        const token = jwt.sign({id: new_user.id, is_admin: new_user.is_admin }, process.env.JWT_SECRET_KEY);
        res.header("auth-token", token).send({id: new_user.id});
    });

});





app.post("/login", async (req, res) => {
    // need email and password
    const email = req.body.email;
    const password = req.body.password;



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
  





