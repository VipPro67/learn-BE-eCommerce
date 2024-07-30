"use strict";
const InventoryService = require("../services/inventory.service");
const { OK, Created } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class InventoryController {
  static async addStock(req, res) {
    const { productId, shopId, stock, location } = req.body;
    if (!productId || !shopId || !stock) {
      throw new BadRequestError("Error: Missing required fields");
    }
    const result = await InventoryService.addStock({
      productId,
      shopId,
      stock,
      location,
    });
    new Created("Add stock success", result).send(res);
  }
}

module.exports = InventoryController;
