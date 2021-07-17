const express = require("express");
const cors = require("cors");

// setting up app
const app = express();
app.use(express.json());
app.use(cors());

/*======= ROUTES =======*/

// GET routes
app.get("/", (req, res) => {
    res.send("Hello from the rest-api server.");
});


app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





