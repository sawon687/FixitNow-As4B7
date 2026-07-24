import { Router } from 'express';
import adminController from './admin.controller';

const routes=Router()

routes.post('/categories',adminController.category)
routes.get('/categories',adminController.getAllCategory)
routes.get('/users',adminController.getAllUsers)
routes.get('/bookings',adminController.getAllBookings)
routes.patch('/users/:id',adminController.userStatusUpdate)
export const adminroutes=routes