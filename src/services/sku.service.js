const { skuModel } = require("../models/sku.model");
const { randomProductId } = require("../utils");
const { spuModel } = require("../models/spu.model");

const newSku = async ({ spu_id, sku_list }) => {
  try {
    const convert_sku_list = sku_list.map((sku) => {
      randomProductId;
      return {
        ...sku,
        product_id: spu_id,
        sku_id: `${spu_id}.${randomProductId()}`,
      };
    });
    const skus = await skuModel.create(convert_sku_list);
    return skus;
  } catch (error) {
    return [];
  }
};
const oneSku = async (sku_id, product_id) => {
  try {
    // read cache
    const sku = await skuModel.findOne({ sku_id, product_id }).lean();
    if (sku) {
      // set cached
    }
    return _.omit(sku, ["__v", "updatedAt", "createdAt", "isDeleted"]);
  } catch (error) {
    return null;
  }
};
const allSkuBySpuId = async ({ product_id }) => {
  try {
    // 1. spu_id
    const skus = await spuModel.find({ product_id });
    return skus;
  } catch (error) {}
};

module.exports = {
  newSku,
  oneSku,
  allSkuBySpuId,
};
