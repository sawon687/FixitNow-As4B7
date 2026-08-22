import { Request, Response } from 'express'
import { baseController } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import customerService from './customer.service'
 import statusCode from 'http-status'

class CustomerController extends baseController{
    
    getCustomerDashboard=this.handle(async(req:Request ,res:Response)=>{
            const userId=req.user?.id as string
            const result= await customerService.getCustomerDashboardDB(userId)
          sendResponse(res,{success:true,message:'dashboard data found', status:statusCode.CREATED , data:result})
  })

 
    
}

export default new CustomerController()