const express = require('express');
const mongoose = require('mongoose');
const db = require("./src/server/keys.js").mongoURI;
const createServer = require("./src/server/createServer.js")


const PORT  = process.env.PORT || 3000;
const app = express();


// middleware 

app.use(express.json());
app.use(express.urlencoded({extended:true}))


mongoose
  .connect(db)
  .then(()=>{
    const app = createServer();
    const port = process.env.PORT || 3000;
    app.listen(port, ()=>{
        console.log(`App is running on port ${port}`)
    })
  }).catch((err)=>{
    console.log(`could not connect to MongoDB and start the server`);
    console.log(err);
  })



app.listen(PORT, "0.0.0.0",()=>{
    console.log(`connected at port ${PORT}`);
});