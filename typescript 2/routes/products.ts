import express from 'express';
const router = express.Router();
import * as productController from '../controller/product';
import authentication from '../middleware/authentication'

router.get('/view-products',authentication,productController.viewAllProducts);
router.get('/view-product/:p_id',authentication,productController.viewProductById);




export default router