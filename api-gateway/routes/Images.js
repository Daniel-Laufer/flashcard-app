const express = require("express");
const router = express.Router();
var multer  = require('multer');
const { authorize } = require("../middleware");
const addresses = require("../misc/api_addresses");
const axios = require('axios');
const fs = require("fs");

const S3 = require("aws-sdk/clients/s3");
const s3_config = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
  
}
const s3 = new S3(s3_config);

const upload_image = async(image) => {
  const fileStream = fs.createReadStream(image.path);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: image.filename // name of file in side s3 bucket
  }
  return s3.upload(uploadParams).promise();
}


const download_image = (imageKey) => {
  const params = {
    Key: imageKey,
    Bucket: process.env.AWS_BUCKET_NAME,
  }
  console.log(params);
  return s3.getObject(params).createReadStream();
}




var upload = multer({ dest: 'uploads/' })
  
router.post('/images', [upload.single('image')], async (req, res) => {
    const image = req.file;
    try{
      const result = await upload_image(image);
      res.status(201).send({"downloadImageRoute": `/images/${result.key}`})
    }
    catch (err){
      console.log(err);
      return res.status(500).send("error uploading image to s3.")
    }
    
  });


router.get("/images/:key", async (req, res) => {
  const key = req.params.key;
  try{
    const readStream = await download_image(key);
    readStream.pipe(res);
  }
  catch (err){
    console.log(err);
    return res.status(500).send("error uploading image to s3.")
  }
});


module.exports = router;