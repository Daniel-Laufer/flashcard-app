const express = require("express");
const app = express();
const router = express.Router();
const axios = require('axios');
const addresses = require("../misc/api_addresses");


/**
 * @swagger
 * /login:
 *  post:
 *      tags:
 *          - auth-server-api
 *      description: logs user into the system
 *      parameters:
 *          - in: "body"
 *            name: "body"
 *            type: object
 *            properties:
 *              username:
 *                  type: string
 *                  example: username123
 *              password:
 *                  type: string
 *                  example: password123
 *            required:
 *              - username
 *              - password
 *      responses:
 *          "200":
 *              description: success
 *              headers:
 *                  auth-token:
 *                      type: "string"
 *                      description: "authentication token"
 *          "400":
 *              description: bad parameters/body provided 
 *          "401":
 *              description: unauthorized
 *          "500":
 *              description: internal server error
 */
 router.post("/login", async (req, res) => {
     console.log("here");
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
 *      description: create a new user and log them in
 *      parameters:
 *          - in: "body"
 *            name: "body"
 *            type: object
 *            properties:
 *              username:
 *                  type: string
 *                  example: username123
 *              password:
 *                  type: string
 *                  example: password123
 *            required:
 *              - username
 *              - password
 *      responses:
 *          "200":
 *              description: success
 *              headers:
 *                  auth-token:
 *                      type: "string"
 *                      description: "authentication token"
 *          "400":
 *              description: bad parameters/body provided 
 *          "401":
 *              description: unauthorized
 *          "500":
 *              description: internal server error
 */
 router.post("/register", async (req, res) => {
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


module.exports = router;