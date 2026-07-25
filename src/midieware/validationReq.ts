import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import status from "http-status";
import { IAuth } from '../module/auth/auth.interface';

const validationReq = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse({
        body: req.body,
      }) as { body: IAuth };

      req.body = data.body as IAuth;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(status.BAD_REQUEST).json({
          success: false,
          status: status.BAD_REQUEST,
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: status.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      });
    }
  };
};

export default validationReq;