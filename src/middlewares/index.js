"use strict";

const { method } = require("lodash");
const LoggerService = require("../loggers/discord.log.js");

const sendMessage = async (req, res, next) => {
  try {
    LoggerService.sendMessage("Test message");
    // res.status(200).json({ message: "Message sent to Discord" });
    next();
  } catch (error) {
    next(error);
  }
};

const sendFormatLog = async (req, res, next) => {
  try {
    LoggerService.sendFormatLog({
      url: req.url,
      method: req.method,
      message: req.body,
    });
    // res.status(200).json({ message: "Message sent to Discord" });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  sendFormatLog,
};
