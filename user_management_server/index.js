const express = require("express");
const cors = require("cors");

// setting up app
const app = express();
app.use(express.json());
app.use(cors());

/*======= ROUTES =======*/

// GET routes
app.get("/", (req, res) => {
    res.send("Hellfo22 world");
});


// POST routes
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        res.status(400).send("invalid parameters.");
    }
    else{
        // generate an auth token
    }
})



app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





