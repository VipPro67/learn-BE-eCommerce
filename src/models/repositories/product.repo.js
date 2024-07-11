"use strict";
const {
  product,
  clothes,
  electronic,
  food,
  drink,
  furniture,
} = require("../product.model");
const { Types } = require("mongoose");
const { BadRequestError } = require("../../core/error.response");
const { update } = require("lodash");
const {
  getSelectFields,
  getUnSelectFields,
  convertToObjectId,
} = require("../../utils");

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const query = {
    ...filter,
  };
  return await product
    .find(query)
    .sort(sort === "ctime" ? { _id: 1 } : { _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select(getSelectFields({ fields: select }))
    .lean()
    .exec();
};

const findProductById = async ({ product_id, unSelect }) => {
  return await product
    .findOne({ _id: product_id })
    .select(getUnSelectFields({ fields: unSelect }))
    .lean()
    .exec();
};

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publicProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    _id: product_id,
    product_shop,
  });
  if (!foundProduct) {
    throw new BadRequestError("Product not found");
  }
  return await product.updateOne(
    { _id: product_id, product_shop },
    { isPublished: true, isDraft: false }
  );
};

const unPublicProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    _id: product_id,
    product_shop,
  });
  if (!foundProduct) {
    throw new BadRequestError("Product not found");
  }
  return await product.updateOne(
    { _id: product_id, product_shop },
    { isPublished: false }
  );
};

const findAllPublicProductByShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const searchProductsUser = async ({ keysearch }) => {
  return await product
    .find({
      $text: { $search: keysearch },

      isPublished: true,
    })
    .sort({
      score: { $meta: "textScore" },
    })
    .lean()
    .exec();
};

const updateProductById = async ({
  product_id,
  shop_id,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  //check product shop is same with shop_id
  console.log(product_id, shop_id);
  const foundProduct = await model.findOne({
    _id: product_id,
    product_shop: shop_id,
  });
  if (!foundProduct) {
    throw new BadRequestError("Product not found or not belong to shop");
  }
  return await model.findOneAndUpdate(
    {
      _id: product_id,
    },
    bodyUpdate,
    {
      new: isNew,
    }
  );
};

const checkProductByServer = async ({ products = [] }) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await findProductById({
        product_id: convertToObjectId(product.productId),
      });
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};
module.exports = {
  findAllDraftForShop,
  publicProductByShop,
  unPublicProductByShop,
  findAllPublicProductByShop,
  searchProductsUser,
  findAllProducts,
  findProductById,
  updateProductById,
  checkProductByServer,
};
