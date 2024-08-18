require('dotenv').config();
const express=require('express')
const Router=express.Router()
Router.get("/getanomalies",(req,res)=>{
    const AWS=require("aws-sdk")
    AWS.config.update({
      region:process.env.AWS_REGION
    })
    const lookout=AWS.LookoutMetrics()
  })
module.exports=Router