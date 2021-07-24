const express = require("express");
const cors = require("cors");



// creating a connection to the postgres db
const pgClient = require("./misc/postgres-client-setup");
const middleware = require("../api-gateway/middleware");


// express app set up
const app = express();
app.use(express.json());
app.use(cors());

// setting up swagger docs
require("./misc/swagger-docs-setup")(app);





/*======= ROUTES =======*/
/**
 * @swagger
 * /locations:
 *  get:
 *      tags:
 *          - auth-server-api
 *      description: get all locations
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: unauthorized
 *          "401":
 *              description: invalid jwt token
 *          "500":
 *              description: internal server error
 */
 app.get("/locations", async (req, res) => {
    try{
        const queryResponse = await pgClient.query("SELECT * FROM location;");
        if(!queryResponse) return res.status(500);
        res.send(queryResponse.rows);
    }
    catch{return res.status(500).send(err);}
});

/**
 * @swagger
 * /locations:
 *  post:
 *      tags:
 *          - api
 *      description: add information about a new location to the database
 *      parameters:
 *          - name: auth-token
 *            in: header
 *          - name: name
 *            in: body
 *            required: true
 *            description: name of this location. For example, '220 North Service Rd W, Oakville, Ontario'
 *          - name: open_hours 
 *            required: true
 *            in: body
 *            description: the hours of operation of this location. For example, '9-5'
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: invalid data provided in body
 *          "500":
 *              description: internal server error
 */
 app.post("/locations", middleware.authorize, async (req, res) => {

    // deconstructing the request body
    const {name, open_hours} = req.body;
    if(!name || !open_hours) return res.status(400).send("invalid body");

    // add location to database
    const text = 'INSERT INTO location(name, open_hours) VALUES($1, $2) RETURNING *'
    const values = [name, open_hours];
    pgClient.query(text, values, (pg_err, pg_res) => {
        if (pg_err) return res.status(500).send(pg_err);

        let new_location = pg_res.rows[0];
        res.status(201).send({id: new_location.id});        
    });
    
});










// create route to retrieve all orders made by a customer with a specific email. 


// start the server
app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





