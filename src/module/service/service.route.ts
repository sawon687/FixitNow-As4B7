import { Router } from 'express';
import serviceController from './service.controller';
import { auth } from '../../midieware/auth';

const router=Router()

router.post('/',auth("TECHNICIAN"),serviceController.createService)
router.get('/',serviceController.getService)
export const serviceRouter=router