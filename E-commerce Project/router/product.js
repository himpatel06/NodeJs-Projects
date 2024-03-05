const express = require('express');
const authentication = require('../middleware/jwtAuth');
const productController = require('../controler/product');

const router = express();

router.get('/get-products',authentication.customer_auth,productController.get_products);
router.get('/get-product/:id',authentication.customer_auth,productController.get_products_byId);
router.post('/post-product',authentication.seller_auth,productController.post_product);

module.exports = router;