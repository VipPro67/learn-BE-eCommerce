"use strict";

const ProductService = require("../services/product.service");
const { Created, OK } = require("../core/success.response");
const { newSpu, oneSpu, oneSku } = require("../services/spu.service");

class ProductController {
  createSpu = async (req, res, next) => {
    try {
      const spu = await newSpu({ ...req.body, product_shop: req.keyStore.userId });
      new Created({
        message: "Success create spu",
        metadata: spu,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  findOneSpu = async (req, res, next) => {
    try {
      const { product_id } = req.query;
      new OK({
        message: "Product One",
        metadata: await oneSpu({ spu_id: product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  findOneSku = async (req, res, next) => {
    try {
      const { sku_id, product_id } = req.query;
      new OK({
        message: "Get sku one",
        metadata: await oneSku(sku_id, product_id),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  async createProduct(req, res, next) {
    try {
      const product = await ProductService.createProduct(
        req.body.product_type,
        req.body
      );
      new Created("Create new product success", product).send(res);
    } catch (error) {
      next(error);
    }
  }

  async getAllDraftForShop(req, res, next) {
    try {
      const products = await ProductService.findAllDraftForShop({
        product_shop: req.keyStore.userId,
      });
      new OK("Get all draft product success", products).send(res);
    } catch (error) {
      next(error);
    }
  }

  async publicProductByShop(req, res, next) {
    try {
      const product = await ProductService.publicProductByShop({
        product_shop: req.keyStore.userId,
        product_id: req.params.product_id,
      });
      new OK("Public product success", product).send(res);
    } catch (error) {
      next(error);
    }
  }

  async unPublicProductByShop(req, res, next) {
    try {
      const product = await ProductService.unPublicProductByShop({
        product_shop: req.keyStore.userId,
        product_id: req.params.product_id,
      });
      new OK("Unpublic product success", product).send(res);
    } catch (error) {
      next(error);
    }
  }

  async getAllPublicProductByShop(req, res, next) {
    try {
      const products = await ProductService.findAllPublicProductByShop({
        product_shop: req.keyStore.userId,
      });
      new OK("Get all public product success", products).send(res);
    } catch (error) {
      next(error);
    }
  }

  // async findProductById(req, res, next) {
  //   try {
  //     const product = await ProductService.findProductById(
  //       req.params.product_id
  //     );
  //     new OK("Get product by id success", product).send(res);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async searchProductsUser(req, res, next) {
    try {
      const products = await ProductService.searchProductsUser({
        keysearch: req.params.keysearch,
      });
      new OK("Search products success", products).send(res);
    } catch (error) {
      next(error);
    }
  }

  async findAllProducts(req, res, next) {
    try {
      const products = await ProductService.findAllProducts(req.query);
      new OK("Get all products success", products).send(res);
    } catch (error) {
      next(error);
    }
  }

  async updateProductById(req, res, next) {
    try {
      const product = await ProductService.updateProductById({
        product_id: req.params.product_id,
        shop_id: req.keyStore.userId,
        type: req.body.product_type,
        payload: req.body,
      });
      new OK("Update product success", product).send(res);
    } catch (error) {
      next(error);
    }
  }

  async findProductById(req, res, next) {
    try {
      const product = await ProductService.findProductById({
        product_id: req.params.product_id,
      });
      new OK("Get product by id success", product).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
