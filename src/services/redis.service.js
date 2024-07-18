"use strict";
const redis = require("redis");
const redisClient = redis.createClient();
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const acquireLock = async (productId, quantity, cartId) => {
  const key = `product:${productId}`;
  const retryTime = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTime; i++) {
    const result = await redisClient.setnx(key, expireTime);
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
  return await redisClient.del(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
