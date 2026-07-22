import { Router } from 'express';
import tecnichianController from './tecnichian.controller';
import { auth } from '../../midieware/auth';



const router=Router()


router.put('/profile',auth('TECHNICIAN'),tecnichianController.tecnProfile)
router.get('/',tecnichianController.getAlltecnishian)
router.post('/availability',auth('TECHNICIAN'),tecnichianController.createAvalibility)
router.get('/availability',auth('TECHNICIAN'),tecnichianController.getAvailability)
router.put('/availability',auth('TECHNICIAN'),tecnichianController.updateAvailability)
router.patch('/bookings/:id',auth('TECHNICIAN'),tecnichianController.updateBookingsStatus)
router.get('/bookings',auth('TECHNICIAN'),tecnichianController.getAllBookingsTecnichian)

export const technicianRouter=router