import { Router } from 'express';
import tecnichianController from './tecnichian.controller';
import tecnichianService from './tecnichian.service';
import { auth } from '../../midieware/auth';



const router=Router()


router.put('/profile',auth('TECHNICIAN'),tecnichianController.tecnProfile)
router.get('/',tecnichianController.getAlltecnishian)
router.get('/:id',tecnichianController.getsingletecnichian)

export const technicianRouter=router