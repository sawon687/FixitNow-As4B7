import { Request, Response } from 'express';
import paymentService from './payment.service';
import { ICustomer } from './payment.interface';
import https from "http-status"
import { baseController } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { prisma } from '../../lib/prisma';
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

    confrimPayment=this.handle(async(req:Request , res:Response)=>{
            const sessionId=req.body.sessionId
          const result =await paymentService.confrimpaymentDB(sessionId)
            sendResponse(res, {
    success: true,
    status: https.OK,
    message: "Payment confirmed successfully",
    data: result,
  });
    })

    userPaymentGet=this.handle(async(req:Request,res:Response)=>{
            const id=req.user?.id as string
            const result=await paymentService.userPaymentGetDB(id)
             sendResponse(res, {
    success: true,
    status: https.OK,
    message: "Payment found",
    data: result,
  });
    })
}

export default new PaymentController()


