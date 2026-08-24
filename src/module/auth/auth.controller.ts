import { Request, Response } from "express";
import { baseController } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IAuth } from "./auth.interface";
import authService from "./auth.service";
import status from "http-status";

class AuthController extends baseController {
  createUser = this.handle(async (req: Request, res: Response) => {
    const payload = req.body as IAuth;

    const result = await authService.createdb(payload);
    if (!result) {
      throw new Error("User creation failed");
    }
    const { accessToken, refreshToken, user } = result;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 24 hour or 7 day
    });
    sendResponse(res, {
      success: true,
      message: "user created successfully",
      status: status.CREATED,
      data: { accessToken, refreshToken, user },
    });
  });

  loginUser = this.handle(async (req: Request, res: Response) => {
    const payload = req.body as IAuth;
    const { accessToken, refreshToken, role } =
      await authService.logindb(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 24 hour or 7 day
    });

    sendResponse(res, {
      success: true,
      message: "user logged in successfully",
      status: status.CREATED,
      data: { accessToken, refreshToken, role },
    });
  });
  meget = this.handle(async (req: Request, res: Response) => {
    const payload = req.user;
    const user = await authService.meDB(payload as { id: string } & IAuth);
    sendResponse(res, {
      success: true,
      message: "user is found",
      status: status.CREATED,
      data: user,
    });
  });
}

export default new AuthController();
