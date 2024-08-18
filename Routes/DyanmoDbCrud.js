

const express = require("express");
const Router = express.Router();
const {createTable,deleteTable,addItem,getItem,deleteItem,updateItem,createClient}=require('../Controllers/DynamoDbCrudController')
Router.post("/createClient",createClient)
//Route to create table in a aws dynamoDB database
Router.post("/createTable",createTable);
//Route to delete table in a aws dynamoDB database
Router.delete("/deleteTable",deleteTable);
//Route to add items to a  table in a aws dynamoDB database
Router.post("/addItem", addItem);
//Route to get a specific item from a table in a aws dynamoDB database
Router.get("/getItem", getItem);
//Route to update a specific item in a  table in a aws dynamoDB database
Router.put("/updateItem", updateItem);
//Route to delete a specific item from  a table in a aws dynamoDB database
Router.delete("/deleteItem", deleteItem);
module.exports = Router;
