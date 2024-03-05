const express = require('express');
const router = express.Router();
const authantication = require('../middleware/jwtAuth');
const cartConstroller = require('../controler/cart')

router.post('/add-to-cart',authantication.customer_auth,cartConstroller.add_to_cart);
router.get('/view-cart',authantication.customer_auth,cartConstroller.view_cart);
router.post('/remove-product-from-cart',authantication.customer_auth,cartConstroller.remove_product);
module.exports = router;