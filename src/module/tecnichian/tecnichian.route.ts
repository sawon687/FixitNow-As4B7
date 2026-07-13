import { Router } from 'express';
import tecnichianController from './tecnichian.controller';
import tecnichianService from './tecnichian.service';



const router=Router()


router.put('/profile',tecnichianController.tecnProfile)
router.post('/service',tecnichianController.createService)

export const technicianRouter=router