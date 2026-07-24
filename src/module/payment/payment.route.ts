import { Router } from 'express';
import paymentController from './payment.controller';
import { auth } from '../../midieware/auth';


const router=Router()

router.post('/create',auth('CUSTOMER'),paymentController.paymentCreate)
router.post('/confirm',auth('CUSTOMER'),paymentController.confrimPayment)
router.get('/',auth('CUSTOMER'),paymentController.userPaymentGet)
export const paymentrouter=router