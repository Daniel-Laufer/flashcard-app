const express = require("express");
const cors = require("cors");



// creating a connection to the postgres db
const pgClient = require("./misc/postgres-client-setup");


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
 *          - api
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
        const queryResponse = await pgClient.query("SELECT * FROM locations;");
        if(!queryResponse) return res.status(500);
        res.send(queryResponse.rows);
    }
    catch (err){return res.status(500).send(err);}
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
 app.post("/locations", async (req, res) => {

    // deconstructing the request body
    const {name, open_hours} = req.body;
    if(!name || !open_hours) return res.status(400).send("invalid body");

    // add location to database
    const text = 'INSERT INTO locations(name, open_hours) VALUES($1, $2) RETURNING *'
    const values = [name, open_hours];
    pgClient.query(text, values, (pg_err, pg_res) => {
        if (pg_err) return res.status(500).send(pg_err);

        let new_location = pg_res.rows[0];
        res.status(201).send({id: new_location.id});        
    });
    
});



/**
 * @swagger
 * /payment_info:
 *  get:
 *      tags:
 *          - api
 *      description: get all locations
 *      parameters:
 *          - name: auth-token
 *            in: header
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
 app.get("/payment_info", async (req, res) => {
    try{
        const queryResponse = await pgClient.query("SELECT * FROM payment_information;");
        if(!queryResponse) return res.status(500);
        res.send(queryResponse.rows);
    }
    catch (err){return res.status(500).send(err);}
});


/**
 * @swagger
 * /payment_info:
 *  post:
 *      tags:
 *          - api
 *      description: add information about a new location to the database
 *      parameters:
 *          - name: auth-token
 *            in: header
 *          - name: full_name
 *            in: body
 *            required: true
 *          - name: card_number 
 *            required: true
 *            in: body
 *          - name: cvv
 *            required: true
 *            in: body
 *          - name: expiration_date
 *            required: true
 *            in: body
 *          - name: postal_code
 *            required: true
 *            in: body
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: invalid data provided in body or missing data in body
 *          "500":
 *              description: internal server error
 */
 app.post("/payment_info", async (req, res) => {
    // deconstructing the request body
    const {full_name, card_number, cvv, expiration_date, postal_code} = req.body;
    const values = [full_name, card_number, cvv, expiration_date, postal_code];
    if(values.includes(null)) return res.status(400).send("invalid body");

    // add location to database
    const text = 'INSERT INTO payment_information(full_name, card_number, cvv, expiration_date, postal_code) VALUES($1, $2, $3, $4, $5) RETURNING *';
    pgClient.query(text, values, (pg_err, pg_res) => {
        if (pg_err) return res.status(500).send(pg_err);

        let new_payment_info = pg_res.rows[0];
        res.status(201).send({id: new_payment_info.id});        
    });
});








/**
 * @swagger
 * /orders:
 *  get:
 *      tags:
 *          - api
 *      description: get all orders
 *      parameters:
 *          - name: auth-token
 *            in: header
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
 app.get("/orders", async (req, res) => {
    try{
        const queryResponse = await pgClient.query("SELECT * FROM orders;");
        if(!queryResponse) return res.status(500);
        res.send(queryResponse.rows);
    }
    catch (err) {return res.status(500).send(err);}
});




/**
 * @swagger
 * /orders:
 *  get:
 *      tags:
 *          - api
 *      description: get all orders from a specific user
 *      parameters:
 *          - name: auth-token
 *            in: header
 *          - name: user_id
 *            in: path
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
 app.get("/orders:user_id", async (req, res) => {
    try{
        const queryResponse = await pgClient.query(`SELECT * FROM orders WHERE user_id=${req.params.user_id};`);
        if(!queryResponse) return res.status(500);
        res.send(queryResponse.rows);
    }
    catch (err) {return res.status(500).send(err);}
});




/**
 * @swagger
 * /orders:
 *  post:
 *      tags:
 *          - api
 *      description: create a new order
 *      parameters:
 *          - name: auth-token
 *            in: header
 *          - name: user_id
 *            in: body
 *            required: true
 *          - name: status
 *            required: true
 *            in: body
 *          - name: created_at
 *            required: true
 *            in: body
 *          - name: location_id
 *            required: true
 *            in: body
 *          - name: size
 *            required: true
 *            in: body
 *          - name: topping_list_id
 *            required: true
 *            in: body
 *          - name: payment_info_id
 *            required: true
 *            in: body
 *          - name: phone_number
 *            required: true
 *            in: body
 *          - name: address
 *            required: true
 *            in: body
 *           
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: invalid data provided in body
 *          "500":
 *              description: internal server error
 */
 app.post("/orders", async (req, res) => {

    // deconstructing the request body
    const {user_id, location_id, payment_info_id, status, created_at, size, toppings, phone_number, address } = req.body;
    const values = [user_id, location_id, payment_info_id, status, created_at, size, toppings, phone_number, address];

    if(values.includes(null)){
        return res.status(400).send("not enough values in body");
    }

    // add location to database
    const text = 'INSERT INTO orders (user_id, location_id, payment_info_id, status, created_at, size, toppings, phone_number, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
    pgClient.query(text, values, (pg_err, pg_res) => {
        if (pg_err) return res.status(500).send(pg_err);

        let new_order = pg_res.rows[0];
        res.status(201).send({id: new_order.id});        
    });
    
});










// create route to retrieve all orders made by a customer with a specific email. 


// start the server
app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





