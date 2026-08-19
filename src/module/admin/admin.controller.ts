import { Request, Response } from 'express';
import { baseController } from '../../utils/catchAsync';
import adminService, { IQuery } from './admin.service';
import { ICategory } from './admin.interface';
import { sendResponse } from '../../utils/sendResponse';
import statuscode  from 'http-status';
import { UsersWhereInput } from '../../../generated/prisma/models';

class AdminCotroller extends baseController{
     category=this.handle(async(req:Request,res:Response)=>{
          const payload=req.body as ICategory
        const category=await adminService.categoryCreatedb(payload)
        sendResponse(res,{message:'Category created successfully',status:statuscode.CREATED,success:true,data:category})
     })

     getAllCategory=this.handle(async(req:Request,res:Response)=>{
          const {search}=req.query
          console.log('server search',search)
        const category=await adminService.getAllCategorydb(search as string)
          sendResponse(res,{message:'get all category',status:statuscode.OK,success:true,data:category})
     })

        getAdminDashboard=this.handle(async(req:Request,res:Response)=>{
      
        const result=await adminService.getAdminDashboarddb()
          sendResponse(res,{message:'get all category',status:statuscode.OK,success:true,data:result})
     })
 updateCategory=this.handle(async(req:Request,res:Response)=>{
              const payload=req.body
              const id=req.params?.id as string
        const category=await adminService.updatecategoreydb(payload,id)
          sendResponse(res,{message:'Category updated successfully',status:statuscode.OK,success:true,data:category})
     })
  
     getAllUsers=this.handle(async(req:Request,res:Response)=>{
         const query=req.query
        const users=await adminService.getAllUsersdb(query as IQuery)
        sendResponse(res,{message:'Get all users',status:statuscode.OK,success:true,data:users})
     })
      getAllBookings=this.handle(async(req:Request,res:Response)=>{
         const booking=await adminService.getAllBookingsdb()

          sendResponse(res,{message:'Get all bookings',status:statuscode.OK,success:true,data:booking})
    })

    userStatusUpdate=this.handle(async(req:Request,res:Response)=>{
            const {status}=req.body;
            console.log('status user',status)
            const id=req.params.id;
            const result=await adminService.updateUserStatusDB(status,id as string)
           console.log({message:' update Status Successfully',status:statuscode.OK,success:true,data:result})
            sendResponse(res,{message:'update Status Successfully',status:statuscode.OK,success:true,data:result})

    })
}

export default new AdminCotroller()