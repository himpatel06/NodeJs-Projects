import express,{Request,Response} from 'express';
const router = express.Router();
import productController from '../controller/product';
import authentication from '../middleware/authentication'
import {joiVlidation} from '../middleware/joi-validation'


router.get('/view-products',authentication,productController.viewAllProducts);
router.get('/view-product/:p_id',joiVlidation('view-product'),authentication,productController.viewProductById);


export default router;