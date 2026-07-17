import { prisma } from '../../lib/prisma';
import { ICategory } from './admin.interface';

class AdminService{
   async categoryCreatedb(payload:ICategory)
    {
         const result=await prisma.category.create({data:payload})
         return result
    }
    async  getAllCategorydb(){
        const result =await prisma.category.findMany()
        return result 
    }
    async getAllUsersdb(){
        const result=await prisma.users.findMany({omit:{password:true}})
      return  result
    }
    async getAllBookingsdb(){
        const result=await prisma.booking.findMany()
        return result
    }
}
export default new AdminService()