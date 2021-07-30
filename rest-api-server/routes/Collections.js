const express = require("express");
const router = express.Router();
const pgClient = require("../misc/postgres-client-setup");
const query_func = require("../misc/postgres_helpers");
var format = require('pg-format');



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
 router.get("/flashcard_collections", async (req, res) => {
    
    const request_authorization_details = JSON.parse(req.headers["authorization_details"]);
    
    if(!request_authorization_details) return res.status(500).send("missing authorization_details header");
    
    const request_user_id = request_authorization_details["user_id"];

    if(!request_user_id) return res.status(500).send("missing user_id property in authorization_details header object");

    query_func(pgClient, `SELECT flashcard_collection.*, users.username, users.profile_picture_url
                          FROM flashcard_collection JOIN users ON flashcard_collection.user_id=users.id `, [])
        .then((query_res) => {
            // remove the rows that this user doesn't have access to
            const filtered_rows = query_res.rows.filter((row) => row["user_id"] == request_user_id || row["public"] == true);
            return res.send(filtered_rows);

        })
        .catch((err) => res.status(500).send(err));
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
 router.post("/flashcard_collections", async (req, res) => {
    // deconstructing the request body
    const {user_id, title, public, flashcards} = req.body;
    let valuesToCreateEmptyCollection = [user_id, title, public].filter((item) => item != null);
    if(!user_id || !title) return res.status(400).send("invalid body");
    
    let text;
    // public must be null
    if(valuesToCreateEmptyCollection.length == 2) text = 'INSERT INTO flashcard_collection(user_id, title) VALUES($1, $2) RETURNING *';
    else text = 'INSERT INTO flashcard_collection(user_id, title, public) VALUES($1, $2, $3) RETURNING *';
    
    // create empty collection with this query

    query_func(pgClient, text, valuesToCreateEmptyCollection)
        .then((query_response) => {
            let new_flashcard_collection_id = query_response.rows[0].id;
            let values = [];
            let card;
            for(let i = 0; i < flashcards.length; i++){
                card = flashcards[i];
                values.push([new_flashcard_collection_id, card["front_text"], card["back_text"], card["front_image_url"] || null, card["back_image_url"] || null]);
            }

            text = format('INSERT INTO flashcard (collection_id, front_text, back_text, front_image_url, back_image_url) VALUES %L RETURNING *', values);
            return query_func(pgClient, text, []);
        })
        .then((query_response) => res.status(201).send({id: query_response.rows[0]["collection_id"]}))
        .catch((err)=> res.status(500).send(err));
   
});


module.exports = router;