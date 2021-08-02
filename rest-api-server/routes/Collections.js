const express = require("express");
const router = express.Router();
const pgClient = require("../misc/postgres-client-setup");
const query_func = require("../misc/postgres_helpers");
var format = require('pg-format');


 // documentation available at <base_url>/api/api-docs/
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
 // documentation available at <base_url>/api/api-docs/
 router.post("/flashcard_collections", async (req, res) => {
    // deconstructing the request body
    const {user_id, title, public, description} = req.body;
    let valuesToCreateEmptyCollection = [user_id, title, public, description];

    if(!user_id || !title) return res.status(400).send("invalid body");
    
    let text = 'INSERT INTO flashcard_collection(user_id, title, public, description) VALUES($1, $2, $3, $4) RETURNING *';
    
    // create empty collection with this query

    query_func(pgClient, text, valuesToCreateEmptyCollection)
        .then((query_response) => {
            console.log(query_response.rows);
            return res.status(201).send({id: query_response.rows[0]["id"]})
        })
            
        .catch((err)=> res.status(500).send(err));
   
});

 // documentation available at <base_url>/api/api-docs/
 router.post("/flashcard_collections/createWithArray", async (req, res) => {
    // deconstructing the request body
    const {user_id, title, public, description, flashcards} = req.body;
    let valuesToCreateEmptyCollection = [user_id, title, public, description];

    let text = 'INSERT INTO flashcard_collection(user_id, title, public, description) VALUES($1, $2, $3, $4) RETURNING *';
    
    // create empty collection with this query

    query_func(pgClient, text, valuesToCreateEmptyCollection)
        .then((query_response) => {
            let new_flashcard_collection_id = query_response.rows[0].id;
            let values = [];
            let card;
            for(let i = 0; i < flashcards.length; i++){
                card = flashcards[i];
                values.push([new_flashcard_collection_id, card["front_text"], card["back_text"], card["front_image_url"], card["back_image_url"]]);
            }
            text = format('INSERT INTO flashcard (collection_id, front_text, back_text, front_image_url, back_image_url) VALUES %L RETURNING *', values);
            return query_func(pgClient, text, []);
        })
        .then((query_response) => res.status(201).send({id: query_response.rows[0]["collection_id"]}))
        .catch((err)=> res.status(500).send(err));
   
});


module.exports = router;