const express = require("express");
const cors = require("cors");

// express app set up
const app = express();
app.use(express.json());



// setting up swagger docs
require("./misc/swagger-docs-setup")(app);

// importing routes
const authRoutes = require("./routes/Auth");
const flashcardCollectionRoutes = require("./routes/Collections");
const flashcardRoutes = require("./routes/Flashcards");


// hooking up the routes 
app.use("/", authRoutes);
app.use("/", flashcardCollectionRoutes);
app.use("/", flashcardRoutes);

app.use(cors());


// start the server
app.listen(5000, (err) => console.log("Listening on port 5000."));