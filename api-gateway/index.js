const express = require("express");
const cors = require("cors");
const axios = require('axios');

// express app set up
const app = express();
app.use(express.json());
app.use(cors());

// setting up swagger docs
require("./misc/swagger-docs-setup")(app);

// importing and configuring middleware 
const middleware = require("./middleware.js");


const addresses = {
    "auth-server": `http://${process.env.AUTH_SERVER_IP}:5000`,
    "rest-api-server":  `http://${process.env.REST_API_SERVER_IP}:5000`
};


// most of the GET routes' code follow a very similar structure, so I wrote this function below
async function standardGetRouteActions(api_name, resource, req, res){
    try{
        const response = await axios.get(`${api_name}/${resource}`);
        return res.status(response.status).send(response.data);
    }
    catch (err){
        if(err.response){
            const status = err.response.status;
            return res.status(status).send(err.response.data);
        }
        return res.status(500).send(err);
    }
}

// most of the POST routes' code follow a very similar structure, so I wrote this function below
async function standardPostRouteActions(api_name, resource, payload, req, res){
    try{
        const response = await axios.post(`${api_name}/${resource}`, payload);
        return res.send(response.data);
    }
    catch (err){
        if(err.response){
            const status = err.response.status;
            return res.status(status).send(err.response.data);
        }
        return res.status(500).send(err);
    }
}




/*======= ATUH-SERVER ROUTES =======*/
/**
 * @swagger
 * /login:
 *  post:
 *      tags:
 *          - auth-server-api
 *      description: log the user specifed by the (email, password) pair in (by return a jwt auth token)
 *      parameters:
 *          - name: email
 *            in: body
 *            required: true
 *          - name: password 
 *            required: true
 *            in: body
 *            description: password must consist of a minimum of 6 characters.
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: bad parameters provided
 *          "500":
 *              description: internal server error
 */
app.post("/login", async (req, res) => {
    const payload = {
        email: req.body.email,
        password: req.body.password
    }
    try{
        const response = await axios.post(addresses["auth-server"].concat("/login"), payload);
        res.status(response.status).header("auth-token", response.headers["auth-token"]).send(response.data);
    }
    catch (err){
        if(err.response){
            const status = err.response.status;
            return res.status(status).send(err.response.data);
        }
        return res.status(500).send(err);
    }
    
});



/**
 * @swagger
 * /register:
 *  post:
 *      tags:
 *          - auth-server-api
 *      description: create a new user specifed by the (email, password) pair and log them in (by return a jwt auth token)
 *      parameters:
 *          - name: email
 *            in: body
 *            required: true
 *          - name: password 
 *            required: true
 *            in: body
 *            description: password must consist of a minimum of 6 characters.
 *      responses:
 *          "200":
 *              description: success
 *          "400":
 *              description: bad parameters provided
 *          "500":
 *              description: internal server error
 */
 app.post("/register", async (req, res) => {
    const payload = {
        email: req.body.email,
        password: req.body.password
    }
    try{
        const response = await axios.post(addresses["auth-server"].concat("/register"), payload);
        res.status(response.status).header("auth-token", response.headers["auth-token"]).send(response.data);
    }
    catch (err){
        if(err.response){
            const status = err.response.status;
            return res.status(status).send(err.response.data);
        }
        return res.status(500).send(err);
    }


});
/*======= REST-API ROUTES =======*/

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
 app.get("/locations", middleware.authorize, async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], "locations", req, res);
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
 *          - name: password 
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
    const payload = {
        name: req.body.name,
        open_hours: req.body.open_hours
    }
    await standardPostRouteActions(addresses["rest-api-server"], "locations", payload, req, res);


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
 app.get("/payment_info", middleware.authorize, async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], "payment_information", req, res);
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
 app.post("/payment_info", middleware.authorize, async (req, res) => {
    const payload = {
        "full_name": req.body.full_name,
        "card_number": req.body.card_number,
        "cvv": req.body.cvv,
        "expiration_date": req.body.expiration_date,
        "postal_code": req.body.postal_code
    }
    await standardPostRouteActions(addresses["rest-api-server"], "payment_info", payload, req, res);


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
 app.get("/orders", middleware.authorize, async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], "orders", req, res);
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
 app.get("/orders:user_id",middleware.authorize, async (req, res) => {
    await standardGetRouteActions(addresses["rest-api-server"], `orders/${req.params.user_id}`, req, res);
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
 app.post("/orders", middleware.authorize, async (req, res) => {
    const payload = {
        "user_id": req.authorization_details.id,
        "location_id":req.body.location_id,
        "payment_info_id":req.body.payment_info_id,
        "status":req.body.status,
        "created_at":req.body.created_at,
        "size":req.body.size,
        "toppings":req.body.toppings,
        "phone_number":req.body.phone_number,
        "address": req.body.address,
    }
    await standardPostRouteActions(addresses["rest-api-server"], "orders", payload, req, res);
    
});





// start the server
app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});