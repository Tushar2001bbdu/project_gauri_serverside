const { S3Client, ListOfObjectsCommands } = require("@aws-sdk/client-s3");
const{decryptData}=require("../Data_Security")
let client=null;
async function createClient(req,res){
    try{
    client = new S3Client({
        region:decryptData(process.env.Region),
        credentials: {
          accessKeyId:decryptData(process.env.AWS_ACCESS_KEY_ID),
          secretAccessKey:decryptData(process.env.AWS_SECRET_ACCESS_KEY),
        },
      });
      res
        .status(200)
        .json({
          "status":"true"
        });
    } catch (error) {
      res.status(500).json({
        "status":"false"
      });
    }
}
async function createBucket(req,res){
    try{
      const { CreateBucketCommand } = require("@aws-sdk/client-s3");
      const bucket = new CreateBucketCommand({ Bucket: req.body.name });
      
      res.status(200).json({
        "status":"true"
        })
    }
    catch(error){
      
      res.status(500).json({
      "status":"false"
      })
    }
        
      
}
async function deleteBucket(req,res){
    
        try {
          const { DeleteBucketCommand } = require("@aws-sdk/client-s3");
          const command = new DeleteBucketCommand({ Bucket: req.body.name });
          await client.send(command);
          res.status(200).json({
            "status":"true"
            })
        } catch (error) {
          res.status(500).json({
      "status":"false"
      })
        }
      
}
async function getListOfBuckets(req,res){
    try{
      const { ListBucketsCommand } = require("@aws-sdk/client-s3");
      const command = new ListBucketsCommand({});
      const response = await client.send(command);
      res.status(200).json(response.Buckets);
    }
    catch(error){
      res.status(500).json({
        "status":"false"
      })
    }
        
      
}
async function addFile(req,res){
    try {
        const { PutObjectCommand } = require("@aws-sdk/client-s3");
        const pa=require('path')
        const os=require('os')
        const path=pa.join(os.homedir(),'desktop',req.body.filename)
        const fs=require('fs')
        const fileStream=fs.createReadStream(path)
        const command = new PutObjectCommand({
          Bucket: req.body.name,
         Key:req.body.key,
          Body:fileStream,
          ContentType:req.body.type
        });
        const response = await client.send(command);
        
        res.status(200).send({
          "status":"true"
        });
      } catch (error) {
        res.status(500).send({
          "status":"false"
        });
      }   
}
async function getFile(req,res){
  
  try{
    const { GetObjectCommand } = require("@aws-sdk/client-s3");
    const {getSignedUrl} =require("@aws-sdk/s3-request-presigner")
  const command = new GetObjectCommand({
    Bucket: req.body.name,
    Key: req.body.key,
  });
  const response_uri = await getSignedUrl(client,command,3000);
 res.status(200).json({
  "access_link":response_uri})
}
catch(error){
  
  res.status(500).json({
    "status":"false"
  })
}
}
async function deleteFile(req,res){
  try{
    const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
    const command = new DeleteObjectCommand({
      Bucket: req.body.name,
      Key: req.body.key,
    });
    
    let response = await client.send(command);
    res.status(200).json({
      "status":"true"
    });
}
catch(error){
  res.status(500).json({
    "status":"false"
  })
}}

async  function copyFile(req,res){
  try{
    const { CopyObjectCommand } = require("@aws-sdk/client-s3");
  const command = new CopyObjectCommand({
    CopySource: req.body.sourceBucket,
    Bucket: req.body.destinationBucket,
    Key: req.body.destinationId,
  });
  const response = await client.send(command);
  res.status(200).json({
    "status":"true"
  });}
  catch(error){
    res.status(500).json({
      "status":"false"
    })
  }
}
async function getListOfObjects(req,res){
  try{
  const{ListObjectsV2Command}=require("@aws-sdk/client-s3")
  // Send the command
  // Define the parameters
const params = {
  Bucket: req.body.name, // The name of the S3 bucket
  Delimiter: '/', // Optional: Use to group keys
  MaxKeys: 1000 // Optional: Maximum number of keys to return
};
const command=new ListObjectsV2Command(params)
const run = async () =>{
  try {
    const data = await client.send(command);
    console.log("Objects:", data.Contents);
    

    if (data.NextContinuationToken) {
    res.status(200).send({"Next Continuation Token:":data.NextContinuationToken});
      // You can use the token to get the next page of results if needed
    }
  } catch (err) {
    res.status(500).send({"status":"false"});
  }
};

run();}
catch(error){
  res.status(500).send({"status":"false"})
}
}
module.exports = {createClient,createBucket,deleteBucket,getListOfBuckets,addFile,deleteFile,copyFile,getFile,getListOfObjects}