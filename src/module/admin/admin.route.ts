import { Router } from 'express';
import adminController from './admin.controller';
import validationReq from '../../midieware/validationReq';
import { categoryValidation } from './admin.validation';
import { auth } from '../../midieware/auth';

const routes=Router()

routes.post('/categories',auth("ADMIN"),validationReq(categoryValidation.createCategoryValidationSchema),adminController.category)
routes.get('/categories',adminController.getAllCategory)
routes.patch('/categories/:id',auth("ADMIN"),adminController.updateCategory)
routes.get('/dashboard',auth('ADMIN'),adminController.getAdminDashboard)
routes.get('/users',auth("ADMIN"),adminController.getAllUsers)
routes.get('/bookings',auth("ADMIN"),adminController.getAllBookings)
routes.patch('/users/:id',auth("ADMIN"),adminController.userStatusUpdate)
export const adminroutes=routes