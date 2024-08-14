const express = require('express')
const app = express()

// middleware 

app.use(function(req,res,next){
    console.log("middleware chal raha");
    next();
})

app.get("/", function(req, res){
    res.send("This is the landing page");
})


app.get("/profile", function(req, res){
    res.send("This is profile page");
});

app.get("/about", function(req, res , next){
    return next(new Error("something went wrong"));
    
});

app.use(function(errm,req,res,next){
    console.error(errm.stack)
    res.status(500).send('Something broke')

})

app.listen(3000);