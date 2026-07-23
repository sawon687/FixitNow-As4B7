import { Router } from 'express';
import paymentController from './payment.controller';
import { auth } from '../../midieware/auth';


const router=Router()

router.post('/create',auth('CUSTOMER'),paymentController.paymentCreate)
router.post('/confirm',auth('CUSTOMER'),paymentController.confrimPayment)
export const paymentrouter=router