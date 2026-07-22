import { Request, Response } from 'express';
import { baseController } from '../utils/catchAsync';
import paymentService from './payment.service';

class PaymentController extends baseController{
    paymentCreate=this.handle(async(req:Request,res:Response)=>{
            const results=await paymentService.paymentCreateDB()
    })
}

export default new PaymentController()