"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 120000;

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCPU = os.cpus().length;
    const memmory = process.memoryUsage().rss;
    console.log(`Number of connections: ${numConnections}`);
    console.log(`Number of CPUs: ${numCPU}`);
    console.log(`Memory usage: ${memmory / 1024 / 1024} MB`);
  }, _SECONDS);
};

module.exports = {checkOverload};
