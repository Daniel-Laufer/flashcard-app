const express = require("express");
const app = express();
const router = express.Router();
const axios = require('axios');
const addresses = require("../misc/api_addresses");

 // documentation available at <base_url>/api/api-docs/
 router.post("/login", async (req, res) => {
     console.log("here");
    const payload = {
        username: req.body.username,
        password: req.body.password
    }
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).send("Invalid username/password supplied");
    }
    try{
        const response = await axios.post(addresses["auth-server"].concat("/login"), payload);
        // console.log(response.headers);
        const token =  response.headers["authorization"].split(" ")[1];
        res.status(response.status).header("authorization", `Bearer ${token}`).send(response.data);
    }
    catch (err){
        if(err.response){
            const status = err.response.status;
            return res.status(status).send(err.response.data);
        }
        return res.status(500).send(err);
    }
    
});

 // documentation available at <base_url>/api/api-docs/
 router.post("/register", async (req, res) => {
    const payload = {
        username: req.body.username,
        password: req.body.password
    }
    try{
        const response = await axios.post(addresses["auth-server"].concat("/register"), payload);
        const token =  response.headers["authorization"].split(" ")[1];
        res.status(response.status).header("authorization", `Bearer ${token}`).send(response.data);
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