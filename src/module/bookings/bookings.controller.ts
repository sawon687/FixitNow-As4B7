import { Request, Response } from 'express';
import { baseController } from '../../utils/catchAsync';
import { ICreateBookingDTO } from './bookings.interface';
import bookingsService from './bookings.service';
import { sendResponse } from '../../utils/sendResponse';
import status from "http-status";

class BookingsController extends baseController{
    createBookings=this.handle(async(req:Request,res:Response)=>{
        const body=req.body 
        const userId=req.user?.id
        const payload={...body,userId}
        const  booking=await bookingsService.createBookings(payload)
          sendResponse(res,{success:true,message:'bookings is successfully', status:status.CREATED , data:booking})
  })
    
}

export default new BookingsController()