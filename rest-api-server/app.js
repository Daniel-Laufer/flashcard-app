


// express app set up
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// setting up swagger docs
require("./misc/swagger-docs-setup")(app);



// importing routes
const flashcardCollectionRoutes = require("./routes/Collections");
const flashcardRoutes = require("./routes/Flashcards");


// hooking up the routes 
app.use("/", flashcardCollectionRoutes);
app.use("/", flashcardRoutes);

module.exports = app;