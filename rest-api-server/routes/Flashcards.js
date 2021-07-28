const express = require("express");
const router = express.Router();
const pgClient = require("../misc/postgres-client-setup");
const query_func = require("../misc/postgres_helpers");
var format = require('pg-format');


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
 router.get("/flashcards/:flashcard_collection_id", async (req, res) => {
    
    query_func(pgClient, `SELECT * FROM flashcard_collection WHERE id=${req.params.flashcard_collection_id};`, [])
        .then((query_res) => {
            const request_authorization_details = JSON.parse(req.headers["authorization_details"]);
            if(!request_authorization_details) return res.status(500).send("missing authorization_details header");
            
            const request_user_id = request_authorization_details["user_id"];

            if(!request_user_id) return res.status(500).send("missing user_id property in authorization_details header object");


            // check to see if user has aceess to this
            // either if they are the owner of the collection, or the collection is publically viewable
            const row = query_res.rows[0];
            if(row["user_id"] == request_user_id || row["public"] == true)
                query_func(pgClient, `SELECT * FROM flashcard WHERE collection_id=${req.params.flashcard_collection_id};`, [])
                    .then((result) => res.send(result.rows));
            else
                return res.status(401).send([]);
            
        })
        .catch((err) => res.status(500).send(err));
});


module.exports = router;