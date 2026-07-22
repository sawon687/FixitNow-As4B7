import { Router } from 'express';
import paymentController from './payment.controller';
import { auth } from '../midieware/auth';

const router=Router()

router.post('/create',auth('CUSTOMER'),paymentController.paymentCreate)
export const paymentrouter=router