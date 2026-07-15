import { Request, Response } from 'express';
import { baseController } from '../../utils/catchAsync';
import { IService, ITecnichianProfile } from './tecnichian.interface';
import tecnichianService from './tecnichian.service';
import { sendResponse } from '../../utils/sendResponse';
import status from "http-status";
import { IAuth } from '../auth/auth.interface';
import { send } from 'node:process';

class TecnichianController extends baseController{
 tecnProfile=this.handle(async(req:Request,res:Response)=>{
           const payload=req.body as ITecnichianProfile
              const id=req.user?.id as string
              const profilepayload={...payload,userId:id}
              console.log('profile technichian', profilepayload)
              const user=await tecnichianService.profiledb(profilepayload)
    sendResponse(res,{success:true,message:'user created successfully', status:status.CREATED,data:user})
      })

      createService=this.handle(async(req:Request,res:Response)=>{
         const payload=req.body as IService
         const userId = (req.user as {id:string}&IAuth)?.id as string
      
         const service=await tecnichianService.createServicedb(payload,userId)

         sendResponse(res,{message:'service created successfully',status:status.CREATED,success:true,data:service})
      })


    getService=this.handle(async(req:Request,res:Response)=>{
           const service=await tecnichianService.getServicedb()
           sendResponse(res,{message:'get all service successfully',status:status.OK,success:true,data:service})
    })

    getAlltecnishian=this.handle(async(req:Request,res:Response)=>{
      const tecnichian=await tecnichianService.getAlltecnichiandb()
      sendResponse(res,{message:'get all tecnishian found',success:true,status:status.OK,data:tecnichian})
    })
      
}


export default new TecnichianController()