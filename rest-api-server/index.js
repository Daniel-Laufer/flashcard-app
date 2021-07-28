const express = require("express");
const cors = require("cors");






// express app set up
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





 




 





























// create route to retrieve all orders made by a customer with a specific email. 


// start the server
app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





