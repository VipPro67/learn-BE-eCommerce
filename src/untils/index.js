"use strict";
const _ = require("lodash");

const getInfoData = ({ fileds = [], data = {} }) => {
  return _.pick(data, fileds);
};
module.exports = {
  getInfoData,
};
