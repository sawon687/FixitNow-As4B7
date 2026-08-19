import { Router } from 'express';
import bookingsController from './bookings.controller';
import { auth } from '../../midieware/auth';
import validationReq from '../../midieware/validationReq';
import { bookingValidation } from './bookings.validation';

const router=Router()

router.post('/',validationReq(bookingValidation.createBookingValidationSchema),
auth('CUSTOMER'),bookingsController.createBookings)
router.get('/',auth('CUSTOMER'),bookingsController.getMyBookings)
router.get('/:id',bookingsController.getsingleBookings)

export const bookingsrouter=router