const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const jwt = require("jsonwebtoken"); 
const bcrypt = require('bcrypt');
const bcrypt_salt_rounds = 10;


// creating a connection to the postgres db
const pgClient = require("./misc/postgres-client-setup");


// express app set up
const app = express();
app.use(express.json());
app.use(cors());

// setting up swagger docs
require("./misc/swagger-docs-setup")(app);


// importing and configuring middleware 
const middleware = require("./middleware.js");


// common function used by both routes below
const issueNewAuthToken = (user) => {
    return jwt.sign({id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET_KEY);
}


/*======= ROUTES =======*/
/**
 * @swagger
 * /register:
 *  post:
 *      tags:
 *          - auth-server-api
 *      description: create a new user specifed by the (email, password) pair and log them in (by return a jwt auth token)
 *      parameters:
 *          - name: email
 *            required: true
 *          - name: password 
 *            required: true
 *            description: password must consist of a minimum of 6 characters.
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: bad parameters provided
 *          "500":
 *              description: internal server error
 */
app.post("/register", async (req, res) => {
    const user_validation_schema = Joi.object({
        password: Joi.string().min(6).required(),
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
    const values = [email, hashed_password];

    let new_user;
    pgClient.query(text, values, (pg_err, pg_res) => {
        if (pg_err){
            console.log(pg_err.stack);
            return res.status(500).send(pg_err);
        }
        new_user = pg_res.rows[0];

        
    });
    const token = issueNewAuthToken(new_user);
    res.header("auth-token", token).send({id: new_user.id});

});



/**
 * @swagger
 * /login:
 *  post:
 *      tags:
 *          - auth-server-api
 *      description: log the user specifed by the (email, password) pair in (by return a jwt auth token)
 *      parameters:
 *          - name: email
 *            required: true
 *          - name: password 
 *            required: true
 *            description: password must consist of a minimum of 6 characters.
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: bad parameters provided
 *          "500":
 *              description: internal server error
 */

app.post("/login", async (req, res) => {
    const user_validation_schema = Joi.object({
        password: Joi.string().min(6).required(),
        email: Joi.string().required().email(),
    });

    const {error} = user_validation_schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // deconstructing the request body
    const {password, email} = req.body;

    const queryResponse = await pgClient.query("SELECT * FROM users WHERE email=$1", [email]);
    const foundUser = queryResponse.rows[0];

    if(!foundUser || foundUser == [])
        return res.status(400).send("this user does not exist.");

    const isValidPassword = await bcrypt.compare(password, foundUser.password);

    if(!isValidPassword) return res.status(401).send("incorect password.");


    const token = issueNewAuthToken(foundUser);
    res.header("auth-token", token).send({id: foundUser.id}); 

});

// create route to retrieve all orders made by a customer with a specific email. 




// start the server
app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





