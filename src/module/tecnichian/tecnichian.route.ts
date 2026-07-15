import { Router } from 'express';
import tecnichianController from './tecnichian.controller';
import tecnichianService from './tecnichian.service';
import { auth } from '../../midieware/auth';



const router=Router()


router.put('/profile',auth('TECHNICIAN'),tecnichianController.tecnProfile)
router.post('/service',auth("TECHNICIAN"),tecnichianController.createService)
router.get('/service',tecnichianController.getService)
router.get('/technicians',tecnichianController.getAlltecnishian)

export const technicianRouter=router