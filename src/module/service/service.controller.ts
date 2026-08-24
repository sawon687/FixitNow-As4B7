import { Request, Response } from "express";
import { baseController } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IAuth } from "../auth/auth.interface";
import serviceService from "./service.service";
import { IService, IServiceQuery } from "./service.interface";
import status from "http-status";
import { IQuery } from "../tecnichian/tecnichian.interface";
class ServiceController extends baseController {
  createService = this.handle(async (req: Request, res: Response) => {
    const payload = req.body as IService;
    const userId = (req.user as { id: string } & IAuth)?.id as string;

    const service = await serviceService.createServicedb(payload, userId);

    sendResponse(res, {
      message: "Service created successfully",
      status: status.CREATED,
      success: true,
      data: service,
    });
  });
  updateService = this.handle(async (req: Request, res: Response) => {
    const body = req.body as IService;
    const userId = (req.user as { id: string } & IAuth)?.id as string;
    const id = String(req.params.id);
    const payload = { ...body, serviceId: id };
    const service = await serviceService.updateServicedb(payload, userId);

    sendResponse(res, {
      message: "Service Updated successfully",
      status: status.CREATED,
      success: true,
      data: service,
    });
  });

  getService = this.handle(async (req: Request, res: Response) => {
    const query = req?.query as unknown as IServiceQuery;
    const service = await serviceService.getAllServices(query);
    sendResponse(res, {
      message: "get all service successfully",
      status: status.OK,
      success: true,
      data: service,
    });
  });

  getsingleServices = this.handle(async (req: Request, res: Response) => {
    const id = req.params?.id as string;
    const service = await serviceService.getsingleServicedb(id);
    sendResponse(res, {
      success: true,
      message: "Service get is successfully",
      status: status.CREATED,
      data: service,
    });
  });
}

export default new ServiceController();
