"use strict";
const {
  product,
  clothes,
  electronic,
  food,
  drink,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const { removeUndefined, updateNestedObject } = require("../utils");

const {
  findAllDraftForShop,
  publicProductByShop,
  findAllPublicProductByShop,
  unPublicProductByShop,
  searchProductsUser,
  updateProductById,
  findProductById,
  findAllProducts,
} = require("../models/repositories/product.repo");
const { remove } = require("lodash");
const { insertInventory } = require("../models/repositories/inventory.repo");

class ProductFactory {
  static getProductClass(type) {
    switch (type) {
      case "clothes":
        return Clothes;
      case "electronic":
        return Electronic;
      case "food":
        return Food;
      case "drink":
        return Drink;
      case "furniture":
        return Furniture;
      default:
        return null;
    }
  }

  static async createProduct(type, data) {
    const productClass = this.getProductClass(type);
    if (!productClass) {
      throw new BadRequestError("Error: Invalid product type", type);
    }
    const newProduct = new productClass(data);
    return await newProduct.createProduct();
  }

  static async updateProductById({ type, product_id, shop_id, payload }) {
    const productClass = this.getProductClass(type);

    if (!productClass) {
      throw new BadRequestError("Error: Invalid product type", type);
    }

    const productInstance = new productClass(payload);
    return await productInstance.updateProductById({
      product_id: product_id,
      shop_id: shop_id,
    });
  }

  static async findAllDraftForShop({ product_shop, limit = 60, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async publicProductByShop({ product_shop, product_id }) {
    return await publicProductByShop({ product_shop, product_id });
  }

  static async unPublicProductByShop({ product_shop, product_id }) {
    return await unPublicProductByShop({ product_shop, product_id });
  }

  static async findAllPublicProductByShop({
    product_shop,
    limit = 60,
    skip = 0,
  }) {
    const query = { product_shop, isDraft: false, isPublished: true };
    return await findAllPublicProductByShop({ query, limit, skip });
  }

  static async searchProductsUser({ keysearch }) {
    return await searchProductsUser({ keysearch });
  }

  static async findAllProducts({
    limit = 60,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_thumbnail", "product_price", "product_type", "product_shop"],
    });
  }

  static async findProductById({ product_id }) {
    return await findProductById({
      product_id,
      unSelect: ["__v", "product_variations"],
    });
  }
}

class Product {
  constructor({
    product_name,
    product_thumbnail,
    product_shop,
    product_price,
    product_quantity,
    product_type,
    product_description,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumbnail = product_thumbnail;
    this.product_shop = product_shop;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_description = product_description;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({
      ...this,
      _id: product_id,
    });

    if (newProduct) {
      await insertInventory({
        productId: product_id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }

  async updateProductById({ product_id, shop_id, bodyUpdate }) {
    return await updateProductById({
      product_id: product_id,
      shop_id: shop_id,
      bodyUpdate: bodyUpdate,
      model: product,
    });
  }
}

class Clothes extends Product {
  async createProduct() {
    const newClothes = await clothes.create(this.product_attributes);
    if (!newClothes) {
      throw new BadRequestError("Error: Cannot create clothes");
    }

    const newProduct = await super.createProduct(newClothes._id);
    if (!newProduct) {
      throw new BadRequestError("Error: Cannot create product");
    }
    return newProduct;
  }

  async updateProductById({ product_id, shop_id }) {
    const objectParams = updateNestedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id: product_id,
        shop_id: shop_id,
        bodyUpdate: {
          product_attributes: removeUndefined(objectParams.product_attributes),
        },
        model: clothes,
      });
    }
    return await super.updateProductById({
      product_id,
      shop_id,
      bodyUpdate: removeUndefined(objectParams),
    });
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes);
    if (!newElectronic) {
      throw new BadRequestError("Error: Cannot create electronic");
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Error: Cannot create product");
    }
    return newProduct;
  }

  async updateProductById({ product_id }) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        bodyUpdate: objectParams.product_attributes,
        model: electronic,
      });
    }
    return await super.updateProductById({
      product_id,
      bodyUpdate: objectParams,
    });
  }
}

class Food extends Product {
  async createProduct() {
    const newFood = await food.create(this.product_attributes);
    if (!newFood) {
      throw new BadRequestError("Error: Cannot create food");
    }

    const newProduct = await super.createProduct(newFood._id);
    if (!newProduct) {
      throw new BadRequestError("Error: Cannot create product");
    }
    return newProduct;
  }

  async updateProductById({ product_id }) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        bodyUpdate: objectParams.product_attributes,
        model: food,
      });
    }
    return await super.updateProductById({
      product_id,
      bodyUpdate: objectParams,
    });
  }
}

class Drink extends Product {
  async createProduct() {
    const newDrink = await drink.create(this.product_attributes);
    if (!newDrink) {
      throw new BadRequestError("Error: Cannot create drink");
    }

    const newProduct = await super.createProduct(newDrink._id);
    if (!newProduct) {
      throw new BadRequestError("Error: Cannot create product");
    }
    return newProduct;
  }

  async updateProductById({ product_id }) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        bodyUpdate: objectParams.product_attributes,
        model: drink,
      });
    }
    return await super.updateProductById({
      product_id,
      bodyUpdate: objectParams,
    });
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create(this.product_attributes);
    if (!newFurniture) {
      throw new BadRequestError("Error: Cannot create furniture");
    }

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Error: Cannot create product");
    }
    return newProduct;
  }

  async updateProductById({ product_id }) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        bodyUpdate: objectParams.product_attributes,
        model: furniture,
      });
    }
    return await super.updateProductById({
      product_id,
      bodyUpdate: objectParams,
    });
  }
}

module.exports = ProductFactory;
