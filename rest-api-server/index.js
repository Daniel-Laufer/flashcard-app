const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const admin = mongoose.mongo.Admin;

// setting up app
const app = express();
app.use(express.json());
app.use(cors());

// importing some predefined variables from keys.js
const keys = require("./keys");
// importing schemas
const Order = require("./models/Order.js");

/*======= Connecting to db =======*/
async function connectToDB(dbURI){
    try{
        console.log(`Attemping to connect to ${dbURI}`);
        await mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log(`Successfully connected to: ${dbURI}`);
    }
    catch{
        console.log("Failed to connect to the database.");
    }
}
connectToDB(keys.dbURI);

/*======= ROUTES =======*/

// GET routes
app.get("/", async (req, res) => {

    try{
        const result = await Order.find();
        res.status(200).send(result);
    }
    catch (err){
        res.status(500).send(err);
    }
    
   

});

app.post("/", async (req, res) => {
    const order = new Order({
        location: "Oakville, ON",
        date: new Date("12/11/1981"),
        order: {
            size: "L",
            extraToppings: []
        },
        paymentInfo: {
            cardNumber: "1234156789123456",
            cvv: 1512,
            expirationDate: new Date("12/11/1981"),
            postalCode: "l6m4c8"
        }
    });

    
    try{
        const savedOrder = await order.save()
        res.status(201).send(savedOrder);
    }
    catch (err){
        res.status(400).send(err);
    }
    

});


app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





