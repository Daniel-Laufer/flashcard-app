const express = require("express");
const router = express.Router();
const axios = require('axios');
const addresses = require("../misc/api_addresses");
const {standardGetRouteActions, standardPostRouteActions} = require("../misc/standard_route_actions");
const middleware = require("../middleware.js");



 router.get("/flashcard_collections", middleware.authorize, async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], "flashcard_collections", req, res, req.authorization_details);
});




 router.post("/flashcard_collections", middleware.authorize,async (req, res) => {
    // deconstructing the request body


    const payload = {
        user_id: req.authorization_details.user_id,
        title: req.body.title,
        public: req.body.public,
        description: req.body.description
    }
    await standardPostRouteActions(addresses["rest-api-server"], "flashcard_collections", payload, req, res);
});

 router.post("/flashcard_collections/createWithArray", middleware.authorize,async (req, res) => {
    // deconstructing the request body


    const payload = {
        user_id: req.authorization_details.user_id,
        title: req.body.title,
        public: req.body.public,
        flashcards: req.body.flashcards,
        description: req.body.description
    }
    await standardPostRouteActions(addresses["rest-api-server"], "flashcard_collections/createWithArray", payload, req, res);
});


module.exports = router;