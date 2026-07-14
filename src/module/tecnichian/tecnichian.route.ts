import { Router } from 'express';
import tecnichianController from './tecnichian.controller';
import tecnichianService from './tecnichian.service';
import { auth } from '../../midieware/auth';



const router=Router()


router.put('/profile',auth('TECHNICIAN'),tecnichianController.tecnProfile)
router.post('/service',auth("TECHNICIAN"),tecnichianController.createService)

export const technicianRouter=router