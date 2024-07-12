"use strict";
const redis = require("redis");
const redisClient = redis.createClient();

const { promisify } = require("util");
const { product } = require("../models/product.model");
const { cart } = require("../models/cart.model");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const e = require("express");
const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `product:${productId}`;
  const retryTime = 10;
  const expireTime = 3000;
  for (let i = 0; i < retryTime; i++) {
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  return false;
};

const releaseLock = async (keyLock) => {
  const delkeyLock = promisify(redisClient.del).bind(redisClient);
  return await delkeyLock(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
