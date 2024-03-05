import express from 'express';
import authentication from '../middleware/authentication';
import * as orderController from '../controller/order'
const router = express.Router();


router.post('/place-order',authentication,orderController.place_order);
router.get('/view-orders',authentication,orderController.view_orders);

export default router;