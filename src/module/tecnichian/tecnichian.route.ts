import { Router } from 'express';
import tecnichianController from './tecnichian.controller';



const router=Router()


router.put('/profile',tecnichianController.tecnProfile)
router.post('/service')

export const technicianRouter=router