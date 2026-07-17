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
 

    createAvalibility=this.handle(async(req:Request,res:Response)=>{
          const payload=req.body
          const userId=req.user?.id as string
       
        
          const availability=await tecnichianService.createAvabilitydb(payload,userId)
          sendResponse(res,{message:'availabililty created is successfully',success:true,status:status.OK,data:availability})

    })

   

      getAllBookingsTecnichian=this.handle(async(req:Request,res:Response)=>{
      console.log('users',req.user)
     const userId=req.user?.id as string
     console.log('userId ',userId)
    const bookings=await tecnichianService.getAllBokingsTecnichiandb(userId)
        sendResponse(res,{success:true,message:'all  bookings tecnichian get  is successfully', status:status.CREATED , data:bookings})
  })
   
      
}


export default new TecnichianController()