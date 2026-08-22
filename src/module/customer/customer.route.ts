import { Router } from 'express';
import customerController from './customer.controller';
import { auth } from '../../midieware/auth';


const router=Router()

router.get('/dashboard',auth('CUSTOMER'),customerController.getCustomerDashboard)



export const customerRouter=router