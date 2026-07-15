import { Request, Response } from 'express';
import { baseController } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { IAuth } from '../auth/auth.interface';
import serviceService from './service.service';
import { IService } from './service.interface';
import status from "http-status";
class ServiceController extends baseController{
   createService=this.handle(async(req:Request,res:Response)=>{
         const payload=req.body as IService
         const userId = (req.user as {id:string}&IAuth)?.id as string
      
         const service=await serviceService.createServicedb(payload,userId)

         sendResponse(res,{message:'service created successfully',status:status.CREATED,success:true,data:service})
      })


    getService=this.handle(async(req:Request,res:Response)=>{
           const service=await serviceService.getServicedb()
           sendResponse(res,{message:'get all service successfully',status:status.OK,success:true,data:service})
    })
}


export default new ServiceController()