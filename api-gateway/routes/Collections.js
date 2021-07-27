const express = require("express");
const router = express.Router();
const axios = require('axios');
const addresses = require("../misc/api_addresses");
const {standardGetRouteActions, standardPostRouteActions} = require("../misc/standard_route_actions");
const middleware = require("../middleware.js");



/**
 * @swagger
 * /flashcards_collections:
 *  get:
 *      tags:
 *          - api
 *      description: get all flashcard collections
 *      parameters:
 *          - in: "header"
 *            name: "auth-token"
 *            type: string
 *      produces:
 *          - "application/json"
 *      responses:
 *          "200":
 *              description: success
 *              schema:
 *                  type: "array"
 *                  items:
 *                      type: "object"
 *                      properties:
 *                          id:
 *                              type: int
 *                              example: 1
 *                          user_id:
 *                              type: int
 *                              example: "English Word Definitions"
 *                          public:
 *                              type: boolean 
 *                              example: false,
 *                          rating:
 *                              type: int
 *                              example: 4
 *          "400":
 *              description: bad parameters/body provided 
 *          "401":
 *              description: unauthorized
 *          "500":
 *              description: internal server error
 */
 router.get("/flashcard_collections", middleware.authorize, async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], "flashcard_collections", req, res, req.authorization_details);
});



/**
 * @swagger
 * /flashcard_collections:
 *  post:
 *      tags:
 *          - api
 *      description: create an empty flashcard collection
 *          
 *      parameters:
 *          - in: "header"
 *            name: "auth-token"
 *            type: string
 *          - in: "body"
 *            name: "body"
 *            type: object
 *            properties:
 *                  title:
 *                      type: string
 *                      example: "English Word Definitions"
 *                  public: 
 *                      type: boolean
 *                      example: true
 *                  rating:
 *                      type: int
 *                      example: 4
 *      
 *                  flashcards:
 *                          type: "array"
 *                          items:
 *                              type: "object"
 *                              properties:
 *                                  front_text:
 *                                          type: string
 *                                          example: 1
 *                                  back_text:
 *                                          type: string
 *                                          example: "English Word Definitions"
 *                                  front_image_url:
 *                                          type: string 
 *                                          example: "https://website/someImage.jpg"
 *                                  back_image_url:
 *                                          type: string
 *                                          example: "https://website/someImage.jpg"
 *                              required:
 *                                  - front_text
 *                                  - back_text      
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
 router.post("/flashcard_collections", middleware.authorize,async (req, res) => {
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


module.exports = router;