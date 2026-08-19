import { Router } from 'express';

import { auth } from '../../midieware/auth';
import reviewController from './review.controller';
import validationReq from '../../midieware/validationReq';
import { reviewValidation } from './review.validation';

const router=Router()
router.post('/',validationReq(reviewValidation.createReviewValidationSchema),
auth('CUSTOMER'),reviewController.reviewCreate)

router.get('/',auth('CUSTOMER'),reviewController.getMyreview)
export const reviewRouter=router