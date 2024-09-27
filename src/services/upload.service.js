const cloudinary = require("../config/cloudinary.config");
const { s3, PutObjectCommand } = require("../config/aws-s3.config");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

//const { GetObjectCommand } = require("@aws-sdk/client-s3");

// Upload file to cloudinary
const uploadFilesFromURL = async ({ fileUrl, type, name }) => {
  try {
    const folderName = type;
    const fileName = name.replace(/\s+/g, "-").toLowerCase();
    const options = {
      folder: folderName,
      public_id: fileName,
    };
    const result = await cloudinary.uploader.upload(fileUrl, options);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error("Upload failed from URL");
  } 
};

const uploadFilesFromLocal = async ({ file }) => {
  try {
    const folderName = "products";
    const fileName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    const options = {
      folder: folderName,
      public_id: fileName,
    };
    const result = await cloudinary.uploader.upload(file.path, options);
    return {
      url: result.secure_url,
      public_id: result.public_id,
      resize: await cloudinary.url(result.public_id, {
        width: 200,
        height: 200,
        crop: "fill",
      }),
    };
  } catch (error) {
    throw new Error("Upload failed from local file");
  }
};

// Upload file to AWS S3
const uploadFilesLocalToS3 = async ({ file }) => {
  try {
    const cloudpront = process.env.AWS_CLOUDFRONT_URL;
    const currentDateTime = new Date().toISOString();
    const key = `${file.originalname}-${currentDateTime}`.replace(/\s+/g, "-");

    // Upload the file to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "image/jpeg",
    });

    await s3.send(uploadCommand);

    // // Generate the signed URL for accessing the file from S3 directly
    // const getObjectCommand = new GetObjectCommand({
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: key,
    // });

    // const url = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 });

    // return url;

    // Generate the signed URL for accessing the file from CloudFront with private key
    console.log("AWS_CLOUDFRONT_KEYPAIR_ID", process.env.AWS_CLOUDFRONT_KEYPAIR_ID);
    console.log("AWS_CLOUDFRONT_PRIVATE_KEY", process.env.AWS_CLOUDFRONT_PRIVATE_KEY);
    console.log("cloudpront", `${cloudpront}/${key}`);
    const url = getSignedUrl({
      url: `${cloudpront}/${key}`,
      dateLessThan: new Date(Date.now() + 3600 * 1000),
      keyPairId: process.env.AWS_CLOUDFRONT_KEYPAIR_ID,
      privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY
    });

    return url;
  } catch (error) {
    throw new Error("Upload failed from local file");
  }
};

module.exports = {
  uploadFilesFromURL,
  uploadFilesFromLocal,
  uploadFilesLocalToS3,
};
