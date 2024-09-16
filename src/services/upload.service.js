"use strict";

// Require the cloudinary library
const cloudinary = require("../config/cloudinary.config");

//upload image to cloudinary using image url

const uploadFileFromURL = async ({ fileUrl, type, name }) => {
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
    console.log(error);
  }
};

const uploadFileFromLocal = async ({ file }) => {
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
    console.log(error);
  }
};

module.exports = { uploadFileFromURL, uploadFileFromLocal };
