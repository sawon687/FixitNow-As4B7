import { Router } from 'express';
import bookingsController from './bookings.controller';
import { auth } from '../../midieware/auth';

const router=Router()

router.post('/',auth('CUSTOMER'),bookingsController.createBookings)
router.get('/',bookingsController.getAllBookings)

export const bookingsrouter=router