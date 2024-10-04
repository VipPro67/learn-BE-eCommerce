'use strict';
const { spuModel } = require("../models/spu.model");
const { newSku, allSkuBySpuId } = require("./sku.service");
const { findShopById } = require("./shop.service");
const { randomProductId } = require("../utils");
const { NotFoundError } = require("../core/error.response");
const _ = require("lodash");

const newSpu = async ({
  product_id,
  product_name,
  product_thumb,
  product_description,
  product_slug,
  product_price,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variations,
  sku_list = [],
}) => {
  try {
    // 1. check if Shop exists

    // const foundShop = await findShopById({ shop_id: product_shop });
    // console.log(foundShop);

    // if (!foundShop) throw new NotFoundError(`Shop not found`);

    // 2. create a new SPU
    const spu = await spuModel.create({
      product_id: randomProductId(),
      product_name,
      product_thumb,
      product_description,
      product_slug,
      product_price,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variations,
    });
    // 3 get spu_id add to sku.service
    if (spu && sku_list.length > 0) {
      // 3. create skus
      newSku({ sku_list, spu_id: spu.product_id }).then();
    }
    // 4. sync data via elasticsearch (search.service)
    // 5. respond result object

    return !!spu;
  } catch (error) {
    console.error(`newSpu Error: ${error}`);
    throw error;
  }
};

const oneSpu = async ({ spu_id }) => {
  try {
    const spu = await SpuModel.findOne({
      product_id: spu_id,
      isPublished: false, // true
    });
    if (!spu) throw new NotFoundError("spu is not found");
    const skus = await allSkuBySpuId({ product_id: spu.product_id });
    return {
      spu_info: _.omit(spu, ["__v", "updatedAt"]),
      sku_list: skus.map((sku) =>
        _.omit(sku, ["__v", "updatedAt", "createdAt", "isDeleted"])
      ),
    };
  } catch (error) {
    return {};
  }
};

module.exports = { newSpu, oneSpu };