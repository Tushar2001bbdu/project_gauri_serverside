require("dotenv").config();
const {decryptData}=require("../Data_Security")
async function encryptData(req,res){
    try{
    const { KMSClient, EncryptCommand } = require("@aws-sdk/client-kms");
  const client = new KMSClient({
    region: decryptData(process.env.AWS_REGION),
    credentials: {
      accessKeyId:decryptData(process.env.AWS_ACCESS_KEY_ID),
      secretAccessKey:decryptData(process.env.AWS_SECRET_ACCESS_KEY),
    },
  });
  const param = {
    KeyId: req.body.Keyid,
    Plaintext: req.body.text,
  };
  const encrypt = new EncryptCommand(param);
  const response = await client.send(encrypt);
  res.status(200).json(response); }
  catch(error){
    res.status(500).json({
        "status":"false"
    })
  }

}
async function DecryptData(req,res){
    try{
    const { KMSClient, DecryptCommand } = require("@aws-sdk/client-kms");
  const client = new KMSClient({
    region:decryptData(process.env.AWS_REGION),
    credentials: {
      accessKeyId:decryptData(process.env.AWS_ACCESS_KEY_ID),
      secretAccessKey:decryptData(process.env.AWS_SECRET_ACCESS_KEY),
    },
  });
  const param = {
    KeyId: req.body.Keyid,
    CipherTextBlob: req.body.cipher,
  };
  const encrypt = new DecryptCommand(param);
  const response = await client.send(encrypt);
  res.status(200).json({"status":response});
}
catch(error){
    res.status(500).json({"status":"false"})
}
}
module.exports={encryptData,DecryptData}