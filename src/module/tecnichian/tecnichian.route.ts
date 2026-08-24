import { Router } from 'express';
import tecnichianController from './tecnichian.controller';
import { auth } from '../../midieware/auth';
import validationReq from '../../midieware/validationReq';
import { technicianValidation } from './tecnichian.validation';



const router=Router()


router.post('/profile',
    validationReq(technicianValidation.technicianProfileValidationSchema),
    auth('TECHNICIAN'),tecnichianController.tecnProfile)
    router.patch('/profile-update',
    validationReq(technicianValidation.updateTechnicianProfileValidationSchema),
    auth('TECHNICIAN'),tecnichianController.updatetechnicianProfile)
router.get('/',tecnichianController.getAlltecnishian)
router.post('/availability',auth('TECHNICIAN'),tecnichianController.createAvalibility)
router.get('/availability',auth('TECHNICIAN'),tecnichianController.getAvailability)
router.get('/availableSlot/:date',tecnichianController.getAvailabieSlot)
router.put('/availability',auth('TECHNICIAN'),tecnichianController.updateAvailability)
router.patch('/bookings/:id',
    validationReq(technicianValidation.updateBookingStatusValidationSchema),
    auth('TECHNICIAN'),tecnichianController.updateBookingsStatus)
router.get('/bookings',auth('TECHNICIAN'),tecnichianController.getAllBookingsTecnichian)
router.get('/my-service',auth('TECHNICIAN'),tecnichianController.getMyService)
router.get('/dashboard',auth('TECHNICIAN'),tecnichianController.gettecnishianDashboard)
export const technicianRouter=router