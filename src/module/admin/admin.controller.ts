import { Request, Response } from 'express';
import { baseController } from '../../utils/catchAsync';
import adminService from './admin.service';
import { ICategory } from './admin.interface';
import { sendResponse } from '../../utils/sendResponse';
import status  from 'http-status';

class AdminCotroller extends baseController{
     category=this.handle(async(req:Request,res:Response)=>{
          const payload=req.body as ICategory
        const category=await adminService.categoryCreatedb(payload)
        sendResponse(res,{message:'category created successfully',status:status.CREATED,success:true,data:category})
     })

     getAllCategory=this.handle(async(req:Request,res:Response)=>{
          
        const category=await adminService.getAllCategorydb()
          sendResponse(res,{message:'get all category',status:status.OK,success:true,data:category})
     })

     getAllUsers=this.handle(async(req:Request,res:Response)=>{
        const users=await adminService.getAllUsersdb()
        sendResponse(res,{message:'Get all users',status:status.OK,success:true,data:users})
     })
}

export default new AdminCotroller()