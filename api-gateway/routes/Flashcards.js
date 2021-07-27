const express = require("express");
const router = express.Router();
const addresses = require("../misc/api_addresses");
const {standardGetRouteActions, standardPostRouteActions} = require("../misc/standard_route_actions");
const middleware = require("../middleware.js");


/**
 * @swagger
 * /flashcards/{flashcard_collection_id}:
 *  get:
 *      tags:
 *          - api
 *      description: get all flashcard belonging to the flashcard collection with id {flashcards_collection_id}. Note that if a flashcard collection is private, you will only be able to view said flashcard collection if you are logged in as the user who owns it.
 *      parameters:
 *          - in: "header"
 *            name: "auth-token"
 *            type: string   
 *      responses:
 *          "200":
 *              description: success
 *              schema:
 *                  type: "array"
 *                  items:
 *                      type: "object"
 *                      properties:
 *                          front_text:
 *                                  type: string
 *                                  example: 1
 *                          back_text:
 *                                  type: string
 *                                  example: "English Word Definitions"
 *                          front_image_url:
 *                                  type: string 
 *                                  example: "https://website/someImage.jpg"
 *                          back_image_url:
 *                                  type: string
 *                                  example: "https://website/someImage.jpg"
 *          "400":
 *              description: bad parameters/body provided 
 *          "401":
 *              description: unauthorized
 *          "500":
 *              description: failed to insert into db due to failed constraint or an internal server error occurred
 */
 router.get("/flashcards/:flashcard_collection_id", middleware.authorize, async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], `flashcards/${req.params.flashcard_collection_id}`, req, res, req.authorization_details);
    });


module.exports = router;