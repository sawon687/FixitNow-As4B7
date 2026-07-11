import { Request, Response } from 'express';
import { baseController } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { IAuth } from './auth.interface';
import authService from './auth.service';
import status from "http-status";

class AuthController extends baseController{
createUser=this.handle(async(req:Request,res:Response)=>{
          const payload=req.body as IAuth
             const user=await authService.createdb(payload )
       sendResponse(res,{success:true,message:'user created successfully', status:status.CREATED,data:user})
     })

     loginUser=this.handle(async(req:Request,res:Response)=>{
          const payload=req.body as IAuth
             const user=await authService.createdb(payload )
       sendResponse(res,{success:true,message:'user created successfully', status:status.CREATED,data:user})
     )
}

export default new AuthController()