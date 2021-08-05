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

 router.get("/flashcard_collections/:collectionId", async (req, res) => {
    
    const collectionId = req.params.collectionId;
    const request_authorization_details = JSON.parse(req.headers["authorization_details"]);
    
    if(!request_authorization_details) return res.status(500).send("missing authorization_details header");
    
    const request_user_id = request_authorization_details["user_id"];

    if(!request_user_id) return res.status(500).send("missing user_id property in authorization_details header object");

    query_func(pgClient, `SELECT * from flashcard_collection where id=${collectionId}`, [])
        .then((query_res) => {
            if(query_res.rows.length == 0) return res.status(400).send("this collection does not exist.")
            if(query_res.rows[0].user_id != request_user_id && !query_res.rows[0].public) return res.status(401).send("unauthorized to view this")
            return res.send(query_res.rows[0]);

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
                values.push([new_flashcard_collection_id, card["front_text"], card["back_text"], card["front_image_key"], card["back_image_key"]]);
            }
            text = format('INSERT INTO flashcard (collection_id, front_text, back_text, front_image_key, back_image_key) VALUES %L RETURNING *', values);
            return query_func(pgClient, text, []);
        })
        .then((query_response) => res.status(201).send({id: query_response.rows[0]["collection_id"]}))
        .catch((err)=> res.status(500).send(err));
   
});



 // documentation available at <base_url>/api/api-docs/
 router.put("/flashcard_collections/:collectionId", async (req, res) => {
    // deconstructing the request body
    const {user_id, title, public, description, flashcards} = req.body;
    let text = `SELECT * from flashcard_collection WHERE id=${req.params.collectionId}`;
    query_func(pgClient, text, [])
        .then((query_response) => {
            if(query_response.rows.length == 0) return res.status(400).send("this collection does not exist.");
            
            // checking to see if the user who sent the request is allowed to update this.
            if(query_response.rows[0].user_id != user_id) return res.status(401).send("unauthorized");
            
            // update this collection
            text = `UPDATE flashcard_collection SET title = '${title}', public = '${public}', description = '${description}', updated_at=to_timestamp(${Date.now()/1000}) WHERE id=${req.params.collectionId}`;
            return query_func(pgClient, text, []);
        })
        .then((query_response) => {
            // delete all the old flashcards
            text = `DELETE FROM flashcard WHERE collection_id=${req.params.collectionId}`;
            return query_func(pgClient, text, []);
        })
        .then((query_response) => {
            // insert all the new flashcards
            let values = [];
            let card;
            for(let i = 0; i < flashcards.length; i++){
                card = flashcards[i];
                values.push([req.params.collectionId, card["front_text"], card["back_text"], card["front_image_key"], card["back_image_key"]]);
            }
            text = format('INSERT INTO flashcard (collection_id, front_text, back_text, front_image_key, back_image_key) VALUES %L RETURNING *', values);
            return query_func(pgClient, text, []);
        })
        .then((query_response) => res.status(201).send("success"))
        .catch((err)=> res.status(500).send(err));

 });

 // documentation available at <base_url>/api/api-docs/
 router.put("/flashcard_collections/:collectionId/rating", async (req, res) => {
    // deconstructing the request body
    const {user_id, rating} = req.body;
    let text = `SELECT * from flashcard_collection WHERE id=${req.params.collectionId}`;
    query_func(pgClient, text, [])
        .then((query_response) => {
            if(query_response.rows.length == 0) return res.status(400).send("this collection does not exist.");
            
            // checking to see if the user who sent the request is allowed to update this. (user who owns this post can't rate their own post, and no one can rate it if it is private)
            if(query_response.rows[0].user_id == user_id && !query_response.rows[0].public) return res.status(401).send("unauthorized");
            
            const oldSumRatings = query_response.rows[0].sumratings;
            const oldNumRatings = query_response.rows[0].numratings;
            // update this collection
            text = `UPDATE flashcard_collection SET sumratings = ${oldSumRatings + rating}, numratings = ${oldNumRatings + 1} WHERE id=${req.params.collectionId}`;
            return query_func(pgClient, text, []);
        })
        .then((query_response) => res.status(201).send("success"))
        .catch((err)=> res.status(500).send(err));

 });

 // documentation available at <base_url>/api/api-docs/
 router.delete("/flashcard_collections/:collectionId", async (req, res) => {
    // deconstructing the request body
    const user_id = req.get("user_id")
    const collectionId = req.params.collectionId;
    let text = `SELECT * from flashcard_collection WHERE id=${collectionId}`;
    query_func(pgClient, text, [])
    .then((query_response) => {
        if(query_response.rows.length == 0) return res.status(400).send("this collection does not exist.");
        
        // checking to see if the user who sent the request is allowed to update this.
        if(query_response.rows[0].user_id != user_id) return res.status(401).send("unauthorized");
        
        // delete this collection and all it's flashcards (they will cascade delete)
        text = `DELETE FROM flashcard_collection WHERE id=${collectionId}`;
            return query_func(pgClient, text, []);
        })
        .then((query_response) => {
            if(res.statusCode == 200)res.send("successful delete")
        })
        .catch((err)=> res.status(500).send(err));

 });


module.exports = router;