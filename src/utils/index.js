"use strict";
//using lodash
const _ = require("lodash");
const { Types } = require("mongoose");
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectFields = ({ fields = [] }) => {
  return Object.fromEntries(fields.map((field) => [field, 1]));
};

const getUnSelectFields = ({ fields = [] }) => {
  return Object.fromEntries(fields.map((field) => [field, 0]));
};
const removeUndefined = (object) => {
  Object.keys(object).forEach(
    (key) => (object[key] == null || object[key] === "") && delete object[key]
  );
  return object;
};

const updateNestedObject = (object) => {
  const finalObj = {};
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === "object" && !Array.isArray(object[key])) {
      const nestedObject = updateNestedObject(object[key]);
      Object.keys(nestedObject).forEach((nestedKey) => {
        finalObj[`${key}.${nestedKey}`] = nestedObject[nestedKey];
      });
    } else {
      finalObj[key] = object[key];
    }
  });
  return finalObj;
};

const convertToObjectId = (id) => {
  return new Types.ObjectId(id);
};

module.exports = {
  getInfoData,
  getSelectFields,
  getUnSelectFields,
  removeUndefined,
  updateNestedObject,
  convertToObjectId,
};
