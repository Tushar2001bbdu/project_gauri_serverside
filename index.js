require('dotenv').config()
const express=require('express')
const app=express()
const helmet=require('helmet')
const rateLimit=require('express-rate-limit')
const limiter=rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
const {queryParser}=require('express-query-parser')
app.use(queryParser({
  parseNull:true,parseBoolean:true
}))
const morgan=require('morgan')
app.use(morgan('dev'))
app.use(limiter)
app.use(helmet())
app.disable('x-powered-by')
app.use(express.json())
app.use("/anomalyD",require('./Routes/AnomalyDetection'))
app.use("/EmailServices",require("./Routes/Email"))
app.use("/ImageRecogServices",require("./Routes/ImageRecognition"))
app.use("/NLPServices",require("./Routes/NLP"))
app.use("/dataSecurityServices",require("./Routes/Security"))
app.use("/DM",require("./Routes/DataManagement"))
app.use("/databaseOperations",require("./Routes/DyanmoDbCrud"))
// Route to set AWS credentials
app.post("/set-aws-credentials", (req, res) => {

  const {createClient,encryptData} =require("./Data_Security")
  createClient();
  let region=encryptData(req.body.AWS_REGION)
  let accessKeyId=encryptData(req.body.AWS_ACCESS_KEY_ID)
  let secretAccessKey=encryptData(req.body.AWS_SECRET_ACCESS_KEY)

  // Update environment variables in memory
  process.env.AWS_REGION = region;
  process.env.AWS_ACCESS_KEY_ID = accessKeyId;
  process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
  process.env.PORT=req.body.PORT
const fs=require("fs")

  // Persist environment variables to .env file
  const envVariables = `
  AWS_REGION=${region}
  AWS_ACCESS_KEY_ID=${accessKeyId}
  AWS_SECRET_ACCESS_KEY=${secretAccessKey}
  `;

  fs.writeFileSync(".env", envVariables);

  res.status(200).send("AWS credentials have been set successfully");
});

app.listen(5000,()=>{
  console.log(`My application is running at ${process.env.PORT}`)
})