import { Request, Response } from "express";
import { baseController } from "../../utils/catchAsync";
import { IQuery, ITecnichianProfile } from "./tecnichian.interface";
import tecnichianService from "./tecnichian.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

class TecnichianController extends baseController {
  tecnProfile = this.handle(async (req: Request, res: Response) => {
    const payload = req.body as ITecnichianProfile;
    const id = req.user?.id as string;
    const profilepayload = { ...payload, userId: id };
    console.log("profile technichian", profilepayload);
    const user = await tecnichianService.profiledb(profilepayload);
    sendResponse(res, {
      success: true,
      message: "user created successfully",
      status: status.CREATED,
      data: user,
    });
  });

  getAlltecnishian = this.handle(async (req: Request, res: Response) => {
    const tecnichian = await tecnichianService.getAlltecnichiandb();
    sendResponse(res, {
      message: "get all tecnishian found",
      success: true,
      status: status.OK,
      data: tecnichian,
    });
  });

  createAvalibility = this.handle(async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.user?.id as string;
    const availability = await tecnichianService.createAvabilitydb(
      payload,
      userId,
    );
    sendResponse(res, {
      message: "availabililty created is successfully",
      success: true,
      status: status.OK,
      data: availability,
    });
  });

  updateBookingsStatus = this.handle(async (req: Request, res: Response) => {
    const payload = req.body;
    const id = req.params.id as string;
    const userId = req.user?.id as string;

    const reuslts = await tecnichianService.BookingsUpdateStatus(
      payload,
      id,
      userId,
    );

    sendResponse(res, {
      message: `bookings is ${payload.status}`,
      success: true,
      status: status.OK,
      data: reuslts,
    });
  });

  getAllBookingsTecnichian = this.handle(
    async (req: Request, res: Response) => {
      console.log("users", req.user);
      const userId = req.user?.id as string;
      console.log("userId ", userId);
      const bookings =
        await tecnichianService.getAllBokingsTecnichiandb(userId);
      sendResponse(res, {
        success: true,
        message: "all  bookings tecnichian get  is successfully",
        status: status.CREATED,
        data: bookings,
      });
    },
  );

  getAvailability = this.handle(async (req: Request, res: Response) => {
    const query = req.query as unknown as IQuery;
    const userId = req.user?.id as string;
    console.log("userId", userId);
    console.log("user", req.user);
    const availabililty = await tecnichianService.getAvabilityDB(userId, query);
    sendResponse(res, {
      success: true,
      message: "availability is found",
      status: status.CREATED,
      data: availabililty,
    });
  });

  updateAvailability = this.handle(async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.user?.id as string;
  
    const updateAvailability = await tecnichianService.updateAvabiltilyDB(
      payload,
      userId,
    
    );
    sendResponse(res, {
      success: true,
      message: "availability updated",
      status: status.OK,
      data: updateAvailability,
    });
  });
}

export default new TecnichianController();
