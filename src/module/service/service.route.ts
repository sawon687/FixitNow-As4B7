import { Router } from 'express';
import serviceController from './service.controller';
import { auth } from '../../midieware/auth';
import adminController from '../admin/admin.controller';
import validationReq from '../../midieware/validationReq';
import { serviceValidation } from './service.validation';

const router=Router()

router.post('/services',validationReq(serviceValidation.createServiceValidationSchema),
 auth("TECHNICIAN"),serviceController.createService)
router.get('/services',serviceController.getService)
router.get('/categories',adminController.getAllCategory)
router.get('/services/:id',serviceController.getsingleServices)
router.patch('/update-service/:id',validationReq(serviceValidation.createServiceValidationSchema),auth('TECHNICIAN'),serviceController.updateService)
export const serviceRouter=router