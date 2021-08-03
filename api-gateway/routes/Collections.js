const express = require("express");
const router = express.Router();
const axios = require('axios');
const addresses = require("../misc/api_addresses");
const {standardGetRouteActions, standardPostRouteActions, standardPutRouteActions, standardDeleteRouteActions} = require("../misc/standard_route_actions");
const middleware = require("../middleware.js");


 // documentation available at <base_url>/api/api-docs/
 router.get("/flashcard_collections", middleware.authorize, async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], "flashcard_collections", req, res, req.authorization_details);
});



 // documentation available at <base_url>/api/api-docs/
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



 // documentation available at <base_url>/api/api-docs/
 router.put("/flashcard_collections/:collectionId", middleware.authorize,async (req, res) => {
    // deconstructing the request body

    const payload = {
        user_id: req.authorization_details.user_id,
        title: req.body.title,
        public: req.body.public,
        flashcards: req.body.flashcards,
        description: req.body.description
    }
    await standardPutRouteActions(addresses["rest-api-server"], `flashcard_collections/${req.params.collectionId}`, payload, req, res);
});

 // documentation available at <base_url>/api/api-docs/
 router.delete("/flashcard_collections/:collectionId", middleware.authorize, async (req, res) => {
    // deconstructing the request body

    let config = {
        headers: {
            "user_id": req.authorization_details.user_id,
        }
    }
    // console.log(user_id)
    await standardDeleteRouteActions(addresses["rest-api-server"], `flashcard_collections/${req.params.collectionId}`, config, req, res);
});


module.exports = router;