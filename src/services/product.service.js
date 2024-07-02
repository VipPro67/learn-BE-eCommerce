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

const {
  findAllDraftForShop,
  publicProductByShop,
  findAllPublicProductByShop,
  unPublicProductByShop,
  searchProductsUser,
  updateProduct,
  findProductById,
  findAllProducts,
} = require("../models/repositories/product.repo");

class ProductFactory {
  static async createProduct(type, data) {
    switch (type) {
      case "clothes":
        return await new Clothes(data).createProduct();
      case "electronic":
        return await new Electronic(data).createProduct();
      case "food":
        return await new Food(data).createProduct();
      case "drink":
        return await new Drink(data).createProduct();
      case "furniture":
        return await new Furniture(data).createProduct();
      default:
        throw new BadRequestError("Error: Invalid product type", type);
    }
  }

  static async updateProduct({ product_id, data }) {}

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
      select: ["product_name", "product_thumbnail", "product_price"],
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
    return await product.create({
      ...this,
      _id: product_id,
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
}

module.exports = ProductFactory;
