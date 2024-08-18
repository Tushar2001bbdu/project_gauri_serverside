const { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand, DetectFacesCommand, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const { decryptData } = require("../Data_Security");
let client = null;

async function createClient(req, res) {
    try {
        client = new RekognitionClient({
            region: decryptData(process.env.AWS_REGION),  // Ensure .env contains AWS_REGION
            credentials: {
                accessKeyId:decryptData(process.env.AWS_ACCESS_KEY_ID),
                secretAccessKey: decryptData(process.env.AWS_SECRET_ACCESS_KEY),
            },
        });
        res
    .status(200)
    .json({
      "status":"true"
    });
    } catch (error) {
      res
      .status(500)
      .json({
        "status":"false"
      });
    }
}

async function facedetectionForImages(req, res) {
    const params = {
        Image: {
            S3Object: {
                Bucket: req.body.bucketName,
                Name: req.body.fileName
            }
        },
        Attributes: ['ALL']
    };

    try {
        const data = await client.send(new DetectFacesCommand(params));
        res.status(200).json({ "success": data.FaceDetails });
    } catch (err) {
        res.status(500).json({"status ": err.message});
    }
}

async function objectdetectionForImages(req, res) {
    const params = {
        Image: {
            S3Object: {
                Bucket: req.body.bucketName,
                Name: req.body.fileName
            }
        },
        Attributes: ['ALL']
    };

    try {
        const data = await client.send(new DetectLabelsCommand(params));
        res.status(200).json({"status": data.Labels });
    } catch (err) {
        res.status(500).json({"status" :err.message});
    }
}

async function faceDetectionForVideos(req, res) {
    const params = {
        Video: {
            S3Object: {
                Bucket: req.body.bucketName,
                Name: req.body.fileName
            }
        },
        Attributes: ["GENERAL_LABELS"],
        Settings: {
            "GeneralLabels": {
                "LabelCategoryInclusionFilters": [req.body.LabelCategoryInclusionFilters],
            }
        },
    };

    try {
        const data = await client.send(new StartLabelDetectionCommand(params));
        console.log(data);

        const input = {
            JobId: data.JobId,
            MaxResults: 10
        };
        let ID = 0;

        function giveData() {
            ID = setInterval(async () => {
                const DATA = await client.send(new GetLabelDetectionCommand(input));
                if (DATA.JobStatus === "FAILED" || DATA.JobStatus === "SUCCEEDED") {
                    console.log("Detected labels: ", JSON.stringify(DATA));
                    clearInterval(ID);
                    res.status(200).json(DATA);
                }
            }, 5000);
        }

        giveData();

    } catch (err) {
        res.status(500).json({"status ":err.message});
    }
}

module.exports = { createClient, facedetectionForImages, objectdetectionForImages, faceDetectionForVideos };
