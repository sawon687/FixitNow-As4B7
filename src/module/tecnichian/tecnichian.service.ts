import { prisma } from '../../lib/prisma';
import { IService, ITecnichianProfile } from './tecnichian.interface';

class  TecnichianService {
 async profiledb(payload:ITecnichianProfile){
    const{userId,bio,skills,location,yearsOfExperience}=payload

    const profileExits=await prisma.technicianProfile.findUnique({where:{id:userId}})
    if(profileExits)
    {
       throw new Error('This id profile allready exits')
    }

   const profile=await prisma.technicianProfile.create({data:{
        userId,
        bio,
        skills,
        location,
        yearsOfExperience
   }})

   if (profile) {
      const userProfile = await prisma.users.findUnique({
        where: {
          id: userId,
        },
        omit:{password:true},
        include: {
          technicianProfile: true,
        },
      });

      return userProfile;
    }

 }

 async createServicedb(payload:IService){
       const {title,technicianId,categoryId,description,price,priceType,location}=payload
      const results=await prisma.service.create({data:{
        title,
        technicianId: String(technicianId),
        categoryId: String(categoryId),
        description,
        price,
        priceType,
        location
      }})
      return results
 }
}


export default new TecnichianService()