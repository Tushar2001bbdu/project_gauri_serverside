const { TranslateClient, TranslateTextCommand } = require('@aws-sdk/client-translate');
const { TextractClient, AnalyzeDocumentCommand } = require("@aws-sdk/client-textract");
let RekogClient
const { decryptData } = require("../Data_Security");
async function createClient(){
    try {
   
        RekogClient = new RekognitionClient({
          region:decryptData(process.env.AWS_REGION),credentials: {
            accessKeyId:decryptData(process.env.AWS_ACCESS_KEY_ID),
            secretAccessKey:decryptData(process.env.AWS_SECRET_ACCESS_KEY),
          },
          
        });
        res
          .status(200)
          .json({
            "status":"true"
          })
      } catch (error) {
        res
          .status(500)
          .json({
            "status":"false"
          })
      }  
}
async function getData(){
    try{
    const client=new TextractClient({
        region:decryptData(process.env.AWS_REGION),credentials: {
          accessKeyId:decryptData(process.env.AWS_ACCESS_KEY_ID),
          secretAccessKey:decryptData(process.env.AWS_SECRET_ACCESS_KEY),
        },
      })
      const params = {
        Document: {
            S3Object: {
                Bucket:req.body.bucketName,
                Name:req.body.fileName
            }
        },
        FeatureTypes: ["TABLES", "FORMS"]
    };
    
    const command = new AnalyzeDocumentCommand(params);
    
    client.send(command)
        .then(data => {
            res.status(200).json({"status:":JSON.stringify(data)});
        })
        .catch(err => {
            res.status(500).json({"status":"false"});
        });}
        catch(error){
            res.status(500).json({
                "status":"false"
            })
        }
}
async function getSentimentAnalysis(req,res){
      // ES5 example
      try{
  const { ComprehendClient, DetectSentimentCommand } = require("@aws-sdk/client-comprehend");
  // a client can be shared by different commands.
const client = new ComprehendClient({
    region:decryptData(process.env.AWS_REGION),credentials: {
      accessKeyId:decryptData(process.env.AWS_ACCESS_KEY_ID),
      secretAccessKey:decryptData(process.env.AWS_SECRET_ACCESS_KEY),
    },
  })


const command = new DetectSentimentCommand({
  Text:req.body.text,
  LanguageCode: req.body.langCode,
});
try {
  const response = await client.send(command);
  res.status(200).json({
    "status":response});
} catch (error){
    res.status(500).json({
        "status":"false"
    })
} }
catch(error){
    res.status(500).json({
        "status":"false"
    })
}
}
async function translate(req,res){
    const client = new TranslateClient({
        region:decryptData(process.env.AWS_REGION),
        credentials: {
          accessKeyId:decryptData(process.env.AWS_ACCESS_KEY_ID),
          secretAccessKey:decryptData(process.env.AWS_SECRET_ACCESS_KEY),
        },
      });
        const text=req.body.text
        const source=req.body.source
        const target=req.body.target
        const params = {
            Text: text,
            SourceLanguageCode: source,
            TargetLanguageCode: target,
          };
        
          try {
            const command = new TranslateTextCommand(params);
            const data = await client.send(command);
            res.status(200).send({"status": data.TranslatedText });
          } catch (error) {
            console.error(error);
            res.status(500).json({"status":"false"});
          }
}
module.exports={createClient,getData,getSentimentAnalysis,translate}