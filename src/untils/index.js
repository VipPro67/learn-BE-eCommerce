"use strict";
const getInfoData = ({ fields = [], object = {} }) => {
  const extractedData = {};

  fields.forEach((field) => {
    if (object.hasOwnProperty(field)) {
      extractedData[field] = object[field];
    }
  });

  return extractedData;
};
module.exports = { getInfoData };
