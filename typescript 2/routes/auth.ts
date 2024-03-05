import express,{Request,Response} from 'express';
import * as authController from '../controller/auth';
import authentication from '../middleware/authentication'
import * as validation from '../middleware/joi-validation'

const router = express.Router();


router.post('/signup',validation.joiVlidation('signup'),authController.signup);
router.get('/login',validation.joiVlidation('login'),authController.login);


 
export{
    router
}