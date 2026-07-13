import { Request, Response } from 'express';
import { baseController } from '../../utils/catchAsync';
import { IService, ITecnichianProfile } from './tecnichian.interface';
import tecnichianService from './tecnichian.service';
import { sendResponse } from '../../utils/sendResponse';
import status from "http-status";
class TecnichianController extends baseController{
 tecnProfile=this.handle(async(req:Request,res:Response)=>{
           const payload=req.body as ITecnichianProfile
              const user=await tecnichianService.profiledb(payload )
    sendResponse(res,{success:true,message:'user created successfully', status:status.CREATED,data:user})
      })

      createService=this.handle(async(req:Request,res:Response)=>{
         const payload=req.body as IService
         const service=await tecnichianService.createServicedb(payload)

         sendResponse(res,{message:'service created successfully',status:status.CREATED,success:true,data:service})
      })
      
}


export default new TecnichianController()