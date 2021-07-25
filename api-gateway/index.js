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


// most of the GET routes' code follow a very similar structure, so I wrote this function below
async function standardGetRouteActions(api_name, resource, req, res){
    try{
        const response = await axios.get(`${api_name}/${resource}`);
        return res.status(response.status).send(response.data);
    }
    catch (err){
        if(err.response){
            const status = err.response.status;
            return res.status(status).send(err.response.data);
        }
        return res.status(500).send(err);
    }
}

// most of the POST routes' code follow a very similar structure, so I wrote this function below
async function standardPostRouteActions(api_name, resource, payload, req, res){
    try{
        const response = await axios.post(`${api_name}/${resource}`, payload);
        return res.send(response.data);
    }
    catch (err){
        if(err.response){
            const status = err.response.status;
            return res.status(status).send(err.response.data);
        }
        return res.status(500).send(err);
    }
}







/*======= ATUH-SERVER ROUTES =======*/
/**
 * @swagger
 * /login:
 *  post:
 *      tags:
 *          - auth-server-api
 *      description: log the user specifed by the (username, password) pair in (by return a jwt auth token)
 *      parameters:
 *          - name: username
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
 *              description: bad parameters/body provided 
 *          "401":
 *              description: unauthorized
 *          "500":
 *              description: internal server error
 */
app.post("/login", async (req, res) => {
    const payload = {
        username: req.body.username,
        password: req.body.password
    }
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).send("bad parameters/body provided ");
    }
    try{
        const response = await axios.post(addresses["auth-server"].concat("/login"), payload);
        res.status(response.status).header("auth-token", response.headers["auth-token"]).send(response.data);
    }
    catch (err){
        if(err.response){
            const status = err.response.status;
            return res.status(status).send(err.response.data);
        }
        return res.status(500).send(err);
    }
    
});



/**
 * @swagger
 * /register:
 *  post:
 *      tags:
 *          - auth-server-api
 *      description: create a new user specifed by the (username, password) pair and log them in (by return a jwt auth token)
 *      parameters:
 *          - name: username
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
        username: req.body.username,
        password: req.body.password
    }
    try{
        const response = await axios.post(addresses["auth-server"].concat("/register"), payload);
        res.status(response.status).header("auth-token", response.headers["auth-token"]).send(response.data);
    }
    catch (err){
        if(err.response){
            const status = err.response.status;
            return res.status(status).send(err.response.data);
        }
        return res.status(500).send(err);
    }

});
/*======= REST-API ROUTES =======*/

/**
 * @swagger
 * /flashcards:
 *  get:
 *      tags:
 *          - api
 *      description: get all flashcard collections
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: bad parameters/body provided 
 *          "401":
 *              description: unauthorized
 *          "500":
 *              description: internal server error
 */
 app.get("/flashcard_collections", async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], "flashcard_collections", req, res);
});



/**
 * @swagger
 * /flashcard_collections:
 *  get:
 *      tags:
 *          - api
 *      description: get all flashcard collections belonging to a specific user
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: bad parameters/body provided 
 *          "401":
 *              description: unauthorized
 *          "500":
 *              description: internal server error
 */
 app.get("/flashcard_collections/:user_id", async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], `flashcard_collections/${req.params.user_id}`, req, res);
});



/**
 * @swagger
 * /flashcard_collections:
 *  post:
 *      tags:
 *          - api
 *      description: create an empty flashcard collection
 *      parameters:
 *          - name: auth-token
 *            in: header
 *            required: true
 *          - name: title
 *            required: true
 *            in: body
 *          - name: public
 *            in: body
 *            description: set public to true if you would like other users to view this flashcard collection
 *          - name: flashcards
 *            in: body
 *            description: a list of simple objects having keys 'front_text', 'back_text', and optionally 'front_image_url' and/or 'back_image_url'.  
 *                           
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: bad parameters/body provided 
 *          "401":
 *              description: unauthorized
 *          "500":
 *              description: failed to insert into db due to failed constraint or an internal server error occurred
 */
 app.post("/flashcard_collections", middleware.authorize,async (req, res) => {
    // deconstructing the request body


    const payload = {
        user_id: req.authorization_details.user_id,
        title: req.body.title,
        public: req.body.public,
        flashcards: req.body.flashcards,
        rating: req.body.rating
    }
    await standardPostRouteActions(addresses["rest-api-server"], "flashcard_collections", payload, req, res);
});

// start the server
app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});