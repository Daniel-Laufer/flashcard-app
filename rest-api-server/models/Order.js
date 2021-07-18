const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date, 
        required: true
    },
    order: {
        size: {
            type: String,
            required: true,
            enum: ["S", "M", "L", "XL"]
        },
        extraToppings: {
            type: [],
            required: true,
        }
    },
    paymentInfo: {
        cardNumber: {
            type: String,
            required: true,
            max: 19,
            min: 16,
        },
        cvv: {
            type: String,
            required: true,
            min: 3,
            max: 4
        },
        expirationDate:{
            type: Date,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
            uppercase: true,
            min:6,
            max: 6
        }
    }
});


module.exports = mongoose.model("Order", orderSchema);