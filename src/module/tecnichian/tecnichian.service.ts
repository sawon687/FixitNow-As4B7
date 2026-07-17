import { prisma } from "../../lib/prisma";
import {  IAvailability, IBookingStatus, ITecnichianProfile } from "./tecnichian.interface";

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
        include: {
          technicianProfile: true,
        },
        omit:{password:true},
      });

      return userProfile;
    }
  }

  
  async getAlltecnichiandb(){
    const results=await prisma.users.findMany({
      where:{role:'TECHNICIAN'},
      include:{
        technicianProfile:true
      }
    })
    return results
  }
 

  async createAvabilitydb(payload:IAvailability,userId:string){
    console.log('abalibilty',payload)
    const technichianExit=await prisma.technicianProfile.findUniqueOrThrow({where:{id:userId}})
    console.log('technishin profile',technichianExit)
    const results=await prisma.availability.create({data:{
      ...payload,
      technicianId:technichianExit.id
    }})

    return results
  }



   async getAllBokingsTecnichiandb(userId:string){
    const  technicianProfile=await prisma.technicianProfile.findUnique({where:{userId}})
    console.log('technishanPRofile',technicianProfile)
    if(!technicianProfile)
    {
       throw new Error('This tecnishian not found pleace update your tecnishian')
    }
   
      const results=await prisma.booking.findMany({where:{technicianId:technicianProfile.id}})
      return results
   }

}

export default new TecnichianService();
