require("dotenv").config();
let client;
async function createClient(req,res){
    const { KMSClient} = require("@aws-sdk/client-kms");
    client = new KMSClient({
      region:req.body.AWS_REGION,
      credentials: {
        accessKeyId:req.body.AWS_ACCESS_KEY_ID,
        secretAccessKey:req.body.AWS_SECRET_ACCESS_KEY,
      },
    });

}
async function encryptData(text){
    try{
    const { EncryptCommand } = require("@aws-sdk/client-kms");
  const param = {
    KeyId: req.body.Keyid,
    Plaintext:text,
  };
  const encrypt = new EncryptCommand(param);
  const response = await client.send(encrypt);
  return response.CiphertextBlob}
  catch(error){
    return "some error occured"
  }

}
async function decryptData(text){
    try{
    const { DecryptCommand } = require("@aws-sdk/client-kms");

  const param = {
    KeyId: req.body.Keyid,
    CipherTextBlob:text,
  };
  const encrypt = new DecryptCommand(param);
  const response = await client.send(encrypt);
  return response.Plaintext;
}
catch(error){
    return "some error occured"
}
}
module.exports={encryptData,decryptData,createClient}