require("dotenv").config();
const express = require("express");
const {
  getSentimentAnalysis,
  translate,

  getData,
  createClient,
} = require("../Controllers/NLPController");

const Router = express.Router();

//Route to set credentials to use my aws services
Router.put("/createClient", createClient);
Router.get("/getData", getData);
Router.get("/getSentimentAnalysis", getSentimentAnalysis);
Router.post("/translate", translate);
module.exports = Router;