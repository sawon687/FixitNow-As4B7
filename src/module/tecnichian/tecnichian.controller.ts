import { Request, Response } from 'express';
import { baseController } from '../../utils/catchAsync';
import { ITecnichianProfile } from './tecnichian.interface';
import tecnichianService from './tecnichian.service';
import { sendResponse } from '../../utils/sendResponse';
import status from "http-status";
class TecnichianController extends baseController{
 tecnProfile=this.handle(async(req:Request,res:Response)=>{
           const payload=req.body as ITecnichianProfile
              const user=await tecnichianService.profiledb(payload )
    sendResponse(res,{success:true,message:'user created successfully', status:status.CREATED,data:user})
      })
}


export default new TecnichianController()