import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { ZodError } from "zod";

export class baseController {
  protected handle(fn: Function) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        await fn(req, res);
      } catch (error: any) {
      

        return res.status(status.INTERNAL_SERVER_ERROR).json({
          success: false,
          status: status.INTERNAL_SERVER_ERROR,
          message: "Internal server error",
          errormessage:
            error instanceof Error ? error.message : error,
        });
      }
    };
  }
}