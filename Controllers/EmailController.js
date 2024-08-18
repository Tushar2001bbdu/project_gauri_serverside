const {
  SESClient,
  SendEmailCommand,
  VerifyEmailIdentityCommand,
} = require("@aws-sdk/client-ses");
const { decryptData } = require("../Data_Security");
let client;
// Function to create the SES client
async function createClient(req, res) {
  try {
     client = new SESClient({
      region: decryptData(process.env.AWS_REGION),
      credentials: {
        accessKeyId: decryptData(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey:decryptData(process.env.AWS_SECRET_ACCESS_KEY),
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

// Function to verify email
async function verifyEmail(req, res) {
  try {
    const params = {
      EmailAddress: req.body.email,
    };
    const command = new VerifyEmailIdentityCommand(params);
    const response = await client.send(command);
    res
    .status(200)
    .json({
      "status":"true"
    });
  } catch (error) {
    console.log(error)
     res
        .status(200)
        .json({
          "status":"false"
        });
  }
}

// Function to send an email
async function sendEmail(req, res) {
  const client2 = new SESClient({
    region: process.env.AWS_REGION,
  });

  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [req.body.targetEmail],
    },
    Message: {
      Body: {
        Text: {
          Data: req.body.textData,
        },
      },
      Subject: {
        Data: req.body.subject,
      },
    },
    Source: req.body.senderEmail,
  });

  try {
    const response = await client2.send(command);
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

module.exports = { createClient, verifyEmail, sendEmail };
