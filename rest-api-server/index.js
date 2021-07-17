const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const admin = mongoose.mongo.Admin;

// setting up app
const app = express();
app.use(express.json());
app.use(cors());






/*======= Connecting to db =======*/



  










/*======= ROUTES =======*/

// GET routes
app.get("/hello", (req, res) => {
    res.send("Hello from the rest-api server.");

    mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.PORT}/dogsDB`, {useNewUrlParser: true}, () => {
        console.log(`connecting to: ${process.env.MONGODB_HOST}:${process.env.PORT}/dogsDB`);
    
        const dogSchema = new mongoose.Schema({
          name: String,
          age: Number,
          breed: String
         });
      
      
      
          const Dog = mongoose.model("Dog", dogSchema);
      
          const dog = new Dog({
              name: "Rex",
              age: 1,
              breed: "Golden Retriever"
          });
      
      
          dog.save();
    });

});


app.listen(5000, (err) => {
    console.log("Listening on port 5000.");
});
  





