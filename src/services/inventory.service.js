'use strict'
const {inventory} = require("../models/inventory.model");
const {findProductById} = require("../models/repositories/product.repo");
const {BadRequestError} = require("../core/error.response");

class InventoryService {
    static async addStock({productId, shopId, stock, location = "unknow"}) {
        const product = await findProductById({productId});
        if (!product) {
            throw new BadRequestError("Error: Product not found", productId);
        }
        const query = {
            inventory_productId: productId,
            inventory_shopId: shopId
        },updateSet = {
            $inc: {inventory_stock: stock},
            $set: {inventory_location: location}
        },options = {upsert: true, new: true};

        return await inventory.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService;