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


// common function used by both routes below
const issueNewAuthToken = (user) => {
    return jwt.sign({user_id: user.id }, process.env.JWT_SECRET_KEY, {expiresIn:"20m"});
}

// wrap queries made by the postgres client in a promise. 
function query_func(client, query_text, query_payload) {
    return new Promise((resolve, reject) => {
        client.query(query_text, query_payload, (err,res) => {
            if(err) reject(err);
            resolve(res);
            
        });
    });
}





 // documentation available at <base_url>/api/api-docs/
 app.get("/authorize", async (req, res) => {
    const token = req.get("authorization").split(" ")[1];
   
    if (!token) return res.status(401).send("Unauthorized");
    try{
        const verification_details = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return res.send(verification_details);
    }
    catch (error){ res.status(401).send("Unauthorized"); }
    
});




 // documentation available at <base_url>/api/api-docs/
app.post("/register", async (req, res) => {
    const user_validation_schema = Joi.object({
        password: Joi.string().min(5).required(),
        username: Joi.string().required().min(5),
    });

    const {error} = user_validation_schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // deconstructing the request body
    const {password, username} = req.body;

    // hashing password. Good explanation of bcrypt here: https://www.reddit.com/r/javascript/comments/9xdri9/how_does_bcrypt_work_it_feels_like_magic/e9rsazc?utm_source=share&utm_medium=web2x&context=3
    const hashed_password = await bcrypt.hash(password, bcrypt_salt_rounds);
    // console.log(hashed_password.length);

    // add user to database
    const text = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *'
    const values = [username, hashed_password];

    let new_user;
    pgClient.query(text, values, (pg_err, pg_res) => {
        if (pg_err){
            return res.status(500).send(pg_err);
        }
        new_user = pg_res.rows[0];
        const token = issueNewAuthToken(new_user);
        res.header("authorization", `Bearer ${token}`).send({id: new_user.id});        
    });
    
});




 // documentation available at <base_url>/api/api-docs/
app.post("/login", async (req, res) => {
    const user_validation_schema = Joi.object({
        password: Joi.string().min(5).required(),
        username: Joi.string().min(5).required(),
    });

    const {error} = user_validation_schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // deconstructing the request body
    const {password, username} = req.body;

    const queryResponse = await pgClient.query("SELECT * FROM users WHERE username=$1", [username]);
    const foundUser = queryResponse.rows[0];

    if(!foundUser || foundUser == [])
        return res.status(400).send("this user does not exist.");

    const isValidPassword = await bcrypt.compare(password, foundUser.password);

    if(!isValidPassword) return res.status(401).send("incorect password.");


    const token = issueNewAuthToken(foundUser);
    res.header("authorization", `Bearer ${token}`).send({id: foundUser.id}); 

});


// start the server
app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





