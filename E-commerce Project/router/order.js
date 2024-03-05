const express = require('express');
const orderController = require('../controler/order');
const authentication = require('../middleware/jwtAuth');

const router = express.Router();

router.post('/place-order',authentication.customer_auth,orderController.place_order);
router.get('/view-all-order',authentication.customer_auth,orderController.view_all_orders);
router.get('/get-order-details/:orderId',authentication.customer_auth,orderController.view_order_byId);
module.exports = router;