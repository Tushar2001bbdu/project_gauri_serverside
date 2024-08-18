const express = require("express");
const Router = express.Router();
require("dotenv").config();

const {createClient,createBucket,deleteBucket,getListOfBuckets,addFile,deleteFile,getFile,copyFile,getListOfObjects}=require("../Controllers/DataManagementController")

Router.put("/createClient",createClient)
   

//Route to create a S3 bucket for my aws account
Router.post("/createBucket",createBucket);
//Route to delete a  specific S3 bucket from my aws account
Router.delete("/deleteBucket", deleteBucket);
//Route to get list of S3 buckets from my aws account
Router.get("/listOfBuckets", getListOfBuckets);
//Route to add objects into my specific S3 bucket of my aws account
Router.post("/addFile", addFile);
//Route to get a specific object of my specific S3 bucket of my aws account
Router.get("/getObject", getFile);
//Route to delete a specific object of my specific S3 bucket from my aws account
Router.delete("/deleteObject", deleteFile);
//Route to copy object from one source S3 bucket to a destination S3 bucket within my aws account
Router.put("/copyObject",copyFile);
//Route to get list of objects
Router.get("/getListOfObjects",getListOfObjects)
module.exports = Router;
