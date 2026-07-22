import { Router } from 'express';
import paymentController from './payment.controller';

const router=Router()

router.post('/create',paymentController.paymentCreate)
export const paymentrouter=router