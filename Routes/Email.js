require("dotenv").config();
const express = require("express");
const router = express.Router();
const { verifyEmail, sendEmail, createClient } = require('../Controllers/EmailController');

// Route to set region to use AWS services
router.put("/createClient", createClient);

// Route to verify any email for SES email service
router.post("/verifyEmail", verifyEmail);

// Initialize SES Client and send email through it
router.post("/sendEmail", sendEmail);

module.exports = router;
