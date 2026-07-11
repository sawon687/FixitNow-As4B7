import { prisma } from '../../lib/prisma';
import { ITecnichianProfile } from './tecnichian.interface';

class  TecnichianService {
 async profiledb(payload:ITecnichianProfile){
    const{userId,bio,skills,location,yearsOfExperience}=payload
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
        include: {
          technicianProfile: true,
        },
      });

      return userProfile;
    }

 }
}


export default new TecnichianService()