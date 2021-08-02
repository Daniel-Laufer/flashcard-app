const express = require("express");
const router = express.Router();
const addresses = require("../misc/api_addresses");
const {standardGetRouteActions, standardPostRouteActions} = require("../misc/standard_route_actions");
const middleware = require("../middleware.js");


 // documentation available at <base_url>/api/api-docs/
 router.get("/flashcards/:flashcard_collection_id", middleware.authorize, async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], `flashcards/${req.params.flashcard_collection_id}`, req, res, req.authorization_details);
    });


module.exports = router;