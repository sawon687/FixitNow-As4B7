import { Request, Response } from 'express';
import { baseController } from '../../utils/catchAsync';
import { ICreateBookingDTO } from './bookings.interface';
import bookingsService from './bookings.service';
import { sendResponse } from '../../utils/sendResponse';
import statusCode from "http-status";

class BookingsController extends baseController{
    createBookings=this.handle(async(req:Request,res:Response)=>{
        const body=req.body 
        const userId=req.user?.id
        const payload={...body,userId}
        const  booking=await bookingsService.createBookings(payload)
          sendResponse(res,{success:true,message:'bookings is successfully', status:statusCode.CREATED , data:booking})
  })

  getMyBookings=this.handle(async(req:Request,res:Response)=>{
     const userId=req.user?.id as string
     const {status}=req.query
    const mybookings=await bookingsService.getMyBokingsdb(userId,status as string)
    console.log('my ',mybookings)
        sendResponse(res,{success:true,message:'all my bookings get is successfully', status:statusCode.OK
           , data:mybookings})
  })
  
    getsingleBookings=this.handle(async(req:Request,res:Response)=>{
      const id=req.params?.id as string
    const bookings=await bookingsService.getsingleBokingsdb(id)
        sendResponse(res,{success:true,message:'bookings get is successfully', status:statusCode.OK , data:bookings})
  })
    
}

export default new BookingsController()