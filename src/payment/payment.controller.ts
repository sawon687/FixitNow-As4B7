import { Request, Response } from 'express';
import { baseController } from '../utils/catchAsync';
import paymentService from './payment.service';
import { ICustomer } from './payment.interface';
import { sendResponse } from '../utils/sendResponse';
import https from "http-status"
class PaymentController extends baseController{
    paymentCreate=this.handle(async(req:Request,res:Response)=>{
              const {bookingId}=req.body
               console.log('bookingsId',bookingId)
              const user=req.user as ICustomer
            const results=await paymentService.paymentCreateDB(bookingId,user)

            sendResponse(res,{
                success:true,
                status:https.OK,
                message:'checkout session created successfull',
                data:results
            })
    })
}

export default new PaymentController()


