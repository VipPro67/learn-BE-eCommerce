"use strict";

// Require the cloudinary library
const cloudinary = require("../config/cloudinary.config");

//upload image to cloudinary using image url

const uploadImageFromURL = async ({ imageUrl, type, name }) => {
  try {
    const folderName = type;
    const fileName = name.replace(/\s+/g, "-").toLowerCase();
    const options = {
      folder: folderName,
      public_id: fileName,
    };
    const result = await cloudinary.uploader.upload(imageUrl, options);
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { uploadImageFromURL };
