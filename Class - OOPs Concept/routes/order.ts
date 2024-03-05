import express,{Request,Response} from 'express';
import authentication from '../middleware/authentication';
import orderController from '../controller/order';
import * as validation from '../middleware/joi-validation'
const router = express.Router();

router.post('/place-order',authentication,orderController.place_order);
router.get('/view-orders',authentication,orderController.view_orders);
router.get('/view-order/:o_id',authentication,validation.joiVlidation('view-order'),orderController.view_order_byId);

export default router;