const express = require("express");
const cors = require("cors");
const axios = require('axios');

// express app set up
const app = express();
app.use(express.json());
app.use(cors());

// setting up swagger docs
require("./misc/swagger-docs-setup")(app);

// importing and configuring middleware 
const middleware = require("./middleware.js");


const addresses = {
    "auth-server": `http://${process.env.AUTH_SERVER_IP}:5000`,
    "rest-api-server":  `http://${process.env.REST_API_SERVER_IP}:5000`
};





/*======= ROUTES =======*/
/**
 * @swagger
 * /login:
 *  post:
 *      tags:
 *          - auth-server-api
 *      description: log the user specifed by the (email, password) pair in (by return a jwt auth token)
 *      parameters:
 *          - name: email
 *            in: body
 *            required: true
 *          - name: password 
 *            required: true
 *            in: body
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
    const payload = {
        email: req.body.email,
        password: req.body.password
    }
    try{
        const response = await axios.post(addresses["auth-server"].concat("/login"), payload);
        res.status(response.status).header("auth-token", response.headers["auth-token"]).send(response.data);
    }
    catch (err){
        const status = err.response.status;
        res.status(status).send(err.response.data);
    }
});



/**
 * @swagger
 * /register:
 *  post:
 *      tags:
 *          - auth-server-api
 *      description: create a new user specifed by the (email, password) pair and log them in (by return a jwt auth token)
 *      parameters:
 *          - name: email
 *            in: body
 *            required: true
 *          - name: password 
 *            required: true
 *            in: body
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
    const payload = {
        email: req.body.email,
        password: req.body.password
    }
    try{
        const response = await axios.post(addresses["auth-server"].concat("/register"), payload);
        res.status(response.status).header("auth-token", response.headers["auth-token"]).send(response.data);
    }
    catch (err){
        const status = err.response.status;
        res.status(status).send(err.response.data);
    }


});


// a little route to test the middleware
// app.get("/secret", middleware.authorize, (req, res) => {
//     res.send(req.authorization_details);
// });
  





// start the server
app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});