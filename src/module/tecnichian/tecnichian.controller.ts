import { Request, Response } from 'express';
import { baseController } from '../../utils/catchAsync';
import {  ITecnichianProfile } from './tecnichian.interface';
import tecnichianService from './tecnichian.service';
import { sendResponse } from '../../utils/sendResponse';
import status from "http-status";


class TecnichianController extends baseController{
 tecnProfile=this.handle(async(req:Request,res:Response)=>{
           const payload=req.body as ITecnichianProfile
              const id=req.user?.id as string
              const profilepayload={...payload,userId:id}
              console.log('profile technichian', profilepayload)
              const user=await tecnichianService.profiledb(profilepayload)
    sendResponse(res,{success:true,message:'user created successfully', status:status.CREATED,data:user})
      })

   

    getAlltecnishian=this.handle(async(req:Request,res:Response)=>{
      const tecnichian=await tecnichianService.getAlltecnichiandb()
      sendResponse(res,{message:'get all tecnishian found',success:true,status:status.OK,data:tecnichian})
    })
    getsingletecnichian=this.handle(async(req:Request,res:Response)=>{
      const id=req.params?.id as string
      const techchian=await tecnichianService.getsingleTecnichiandb(id)

         sendResponse(res,{message:'get tecnishian found',success:true,status:status.OK,data:techchian})
    })
      
}


export default new TecnichianController()