"use strict";
//using lodash
const _ = require("lodash");
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectFields = ({ fields = [] }) => {
  return Object.fromEntries(fields.map((field) => [field, 1]));
};

const getUnSelectFields = ({ fields = [] }) => {
  return Object.fromEntries(fields.map((field) => [field, 0]));
};

module.exports = { getInfoData, getSelectFields, getUnSelectFields };
