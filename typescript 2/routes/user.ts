import express from 'express';
import authentication from '../middleware/authentication'
import * as userController from '../controller/user'
const router = express.Router();

router.post('/update-user',authentication,userController.update_user);
router.get('/get-user',authentication,userController.getUserById);


export default router;