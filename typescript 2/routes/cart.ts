import express from 'express';
const router = express.Router();
import authentication from '../middleware/authentication'
import * as cartController from '../controller/cart'
import * as validation from '../middleware/joi-validation'

router.post('/add-to-cart',authentication,validation.joiVlidation('cart'),cartController.addToCart);
router.get('/view-cart',authentication,cartController.view_cart);


export default router;