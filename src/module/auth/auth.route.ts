import { Router } from 'express';
import authController from './auth.controller';
import { auth } from '../../midieware/auth';


const router=Router()


router.post('/register',authController.createUser)
router.post('/login',authController.loginUser)
router.get('/me',auth('CUSTOMER','ADMIN','TECHNICIAN'),authController.meget)

export const authRouter=router