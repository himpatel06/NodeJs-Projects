import express,{Request,Response} from 'express';
import authentication from '../middleware/authentication';
import cartController from '../controller/cart';
import * as validation from '../middleware/joi-validation'

const router = express.Router();


router.post('/add-to-cart',authentication,validation.joiVlidation('cart'),cartController.addToCart);
router.get('/view-cart',authentication,cartController.view_cart);


export default router;

