import { prisma } from "../../lib/prisma";
import { IService, ITecnichianProfile } from "./tecnichian.interface";

class TecnichianService {
  async profiledb(payload: ITecnichianProfile) {
    const { userId, bio, skills, location, yearsOfExperience } = payload;

    const profileExits = await prisma.technicianProfile.findUnique({
      where: { id: userId },
    });
    if (profileExits) {
      throw new Error("This id profile allready exits");
    }

    const profile = await prisma.technicianProfile.create({
      data: {
        userId,
        bio,
        skills,
        location,
        yearsOfExperience,
      },
    });

    if (profile) {
      const userProfile = await prisma.users.findUnique({
        where: {
          id: userId,
        },
        omit: { password: true },
        include: {
          technicianProfile: true,
        },
      });

      return userProfile;
    }
  }

  
  async getAlltecnichiandb(){
    const results=await prisma.users.findMany({where:{role:'TECHNICIAN'},omit:{password:true},
      include:{
        technicianProfile:true
      }
    })
    return results
  }
  async getsingleTecnichiandb(id:string){
    const results=await prisma.technicianProfile.findUniqueOrThrow({where:{id},
     include:{
      technician:true,
      reviews:true
     }
    })
    return results
  }
}

export default new TecnichianService();
