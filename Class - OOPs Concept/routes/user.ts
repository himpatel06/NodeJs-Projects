import express,{Request,Response} from 'express';
import authentication from '../middleware/authentication'
import userController from '../controller/user';
const router = express.Router();


router.post('/update-user',authentication,userController.update_user);
router.get('/get-user',authentication,userController.getUserById);


export default router;