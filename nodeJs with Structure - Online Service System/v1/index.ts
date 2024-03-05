import express,{Request,Response} from 'express'
import authController from './controller/auth'
import professionController from './controller/profession'
import instructorController from './controller/instuctor'
import serviceController from './controller/services'
import * as scheduleController from './controller/schedule'
import * as appointmnetConstroller from './controller/appointment'
import cron from 'node-cron'


const router = express.Router();




//cron.schedule('0 0 * * *',appointmnetConstroller.updateAppointmentStatus);
//cron.schedule('0 0 * * *',scheduleController.updateAllScheduleTimeStatus);
//cron.schedule('*/1 * * * *',appointmnetConstroller.updateAppointmentApproval)

router.use('/auth',authController);
router.use('/profession',professionController);
router.use('/instructor',instructorController);
router.use('/service',serviceController);
router.use('/schedule',scheduleController.router);
router.use('/appointment',appointmnetConstroller.router);
router.use((req:Request, res:Response) => {
    res.status(404).send("404 Page Not Found! Sorry, the page you're looking for doesn't exist.");
});




module.exports = router;