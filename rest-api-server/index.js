const express = require("express");
const cors = require("cors");



// creating a connection to the postgres db
const pgClient = require("./misc/postgres-client-setup");
var format = require('pg-format');


// express app set up
const app = express();
app.use(express.json());
app.use(cors());

// setting up swagger docs
require("./misc/swagger-docs-setup")(app);


function query_func(client, query_text, query_payload) {
    return new Promise((resolve, reject) => {
        client.query(query_text, query_payload, (err,res) => {
            if(err) reject(err);
            resolve(res);
            
        });
    });
}




 app.get("/flashcard_collections", async (req, res) => {
    query_func(pgClient, `SELECT * FROM flashcard_collection;`, [])
        .then((query_res) => res.send(query_res.rows))
        .catch((err) => res.status(500).send(err));
});




 app.get("/flashcard_collections/:user_id", async (req, res) => {
    query_func(pgClient, `SELECT * FROM flashcard_collection WHERE user_id=${req.params.user_id};`, [])
        .then((query_res) => res.send(query_res.rows))
        .catch((err) => res.status(500).send(err));
});





 app.post("/flashcard_collections", async (req, res) => {
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



















// create route to retrieve all orders made by a customer with a specific email. 


// start the server
app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





