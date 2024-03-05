import express,{Request,Response} from 'express';
import  Auth  from '../controller/auth';
import * as validation from '../middleware/joi-validation'

const router = express.Router();


router.post('/signup',validation.joiVlidation('signup'),Auth.signup);
router.get('/login',validation.joiVlidation('login'),Auth.login);


 
export{
    router
}