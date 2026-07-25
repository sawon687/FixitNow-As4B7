import { Router } from 'express';
import authController from './auth.controller';
import { auth } from '../../midieware/auth';
import validationReq from '../../midieware/validationReq';
import { authValidation } from './auth.validation';




const router=Router()


router.post('/register',validationReq(authValidation.userLoginValidationSchema),authController.createUser)
router.post('/login',authController.loginUser)
router.get('/me',auth('CUSTOMER','ADMIN','TECHNICIAN'),authController.meget)

export const authRouter=router