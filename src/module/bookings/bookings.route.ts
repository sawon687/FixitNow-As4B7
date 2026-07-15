import { Router } from 'express';
import bookingsController from './bookings.controller';
import { auth } from '../../midieware/auth';

const router=Router()

router.post('/',auth('CUSTOMER'),bookingsController.createBookings)
router.get('/',bookingsController.getAllBookings)
router.get('/:id',bookingsController.getsingleBookings)

export const bookingsrouter=router