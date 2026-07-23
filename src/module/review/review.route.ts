import { Router } from 'express';

import { auth } from '../../midieware/auth';
import { Role } from '../../../generated/prisma/enums';
import reviewController from './review.controller';

const router=Router()
router.post('/',auth('CUSTOMER'),reviewController.reviewCreate)
export const reviewRouter=router