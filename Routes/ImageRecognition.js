const express = require('express');
const Router = express.Router();

const {
    createClient,
    facedetectionForImages,
    objectdetectionForImages,
    faceDetectionForVideos
} = require('../Controllers/ImageRecognitionController');

// Define routes and associate them with the controller functions
Router.put("/createClient", createClient);
Router.get("/facedetectionForImages", facedetectionForImages);
Router.get("/objectdetectionForImages", objectdetectionForImages);
Router.get("/objectdetectionForVideos", faceDetectionForVideos);

module.exports = Router;
