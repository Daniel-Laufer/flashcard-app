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
const imageRoutes = require("./routes/Images");

// hooking up the routes 
app.use("/user", authRoutes);
app.use("/", flashcardCollectionRoutes);
app.use("/", flashcardRoutes);
app.use("/", imageRoutes);

app.use(cors());

module.exports = app;