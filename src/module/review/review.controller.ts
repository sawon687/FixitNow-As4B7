import { Request, Response } from "express";
import { baseController } from "../../utils/catchAsync";
import reviewService from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { Role } from "../../../generated/prisma/enums";
class ReviewController extends baseController {
  // create review
  reviewCreate = this.handle(async (req: Request, res: Response) => {
    const user = req.user as { id: string; role: Role } | undefined;
    if (!user) {
      return sendResponse(res, {
        success: false,
        status: status.UNAUTHORIZED,
        message: "Unauthorized user",
      });
    }

    const { id: userId, role } = user;
    const body = req.body;
    const payload = { ...body, userId };
     console.log('contoller',payload)
    const result = await reviewService.createReviewDB(payload, role);

    sendResponse(res, {
      success: true,
      status: status.OK,
      message: "Review created successfully",
      data: result,
    });
  });

  getMyreview = this.handle(async (req: Request, res: Response) => {
    const id= req.user?.id as string


    const result = await reviewService.getMyReviewDB(id)
    sendResponse(res, {
      success: true,
      status: status.OK,
      message: "Review found successfully",
      data: result,
    });
  });
}

export default new ReviewController();
