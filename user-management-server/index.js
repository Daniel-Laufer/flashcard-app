const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const admin = mongoose.mongo.Admin;


// express app set up
const app = express();
app.use(express.json());
app.use(cors());


// AWS setup/config
const AWS = require("aws-sdk");
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "pizza_app_users";




const getOrders = async () => {
    const params = {
        TableName: TABLE_NAME
    };
    return await dynamoClient.scan(params).promise();
} 

const createUser = async (params) => {   

    // docClient.put is used to create NEW documents in the table
    return await dynamoClient.put(params).promise();
}

// importing schemas
// const Order = require("./models/Order.js");

/*======= ROUTES =======*/

// GET routes
app.get("/", async (req, res) => {
    try{
        const result = await getOrders();
        res.status(200).send(result);
    }
    catch (err){
        res.status(500).send(err);
    }
});

app.post("/", async (req, res) => {

    const params = {
        TableName: TABLE_NAME,
        Item:{
            "id": "3rasdfasdfasdf12125112",
            "firstName": "Daniel",
            "lastName": "Laufer",
            "phoneNumber": "905-510-8458"
        }
    }  

    try{
        await createUser(params);
        res.status(201).send(params);
    }
    catch (err){
        res.status(400).send(err);
    }

});


app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





