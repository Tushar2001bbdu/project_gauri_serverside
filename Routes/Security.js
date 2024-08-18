
const express = require("express");
const { encryptData, DecryptData } = require("../Controllers/SecurityController");
const Router = express.Router();
Router.get("/encryptData", encryptData);
Router.get("/decryptData", DecryptData);
module.exports = Router;
