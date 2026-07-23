import { BookingStatus, PaymentStatus } from '../../../generated/prisma/enums';
import { prisma } from "../../lib/prisma";
import {  IAvailability, IBookingStatus, IQuery, ITecnichianProfile } from "./tecnichian.interface";

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
      },
      omit:{password:true}
    })
    return results
  }
 

  async createAvabilitydb(payload:IAvailability,userId:string){
    console.log('abalibilty',payload)
    const technichianExit=await prisma.technicianProfile.findUniqueOrThrow({where:{userId}})
    console.log('technishin profile',technichianExit)
    const results=await prisma.availability.create({data:{
      ...payload,
      technicianId:technichianExit.id
    }})

    return results
  }


async BookingsUpdateStatus(payload: IBookingStatus,id:string, userId: string){

  const technicianProfile= await prisma.technicianProfile.findUnique({
    where:{userId}
  })

if(!technicianProfile){
    throw new Error("Technician profile not found")
  }

    
  const bookingExists = await prisma.booking.findUnique({
    where:{
      id,
      technicianId: technicianProfile.id
     
    }
  })


  if(!bookingExists){
    throw new Error("Booking not found or unauthorized")
  }
  
  const results = await prisma.booking.update({
    where:{id,technicianId:technicianProfile.id},
    data:{...payload, 
      completedAt:payload.status===BookingStatus.COMPLETED?new Date():null,
      cancelledAt:payload.status===BookingStatus.CANCELLED?new Date():null}
  })

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

  async getAvabilityDB(userId:string,query:IQuery){
   const date = query?.date;
     const technichianProfile=await prisma.technicianProfile.findUnique({where:{userId}})
     if(!technichianProfile){
       throw new Error('Technician profile not found')
     }

     const { id } = technichianProfile;
   
     const results = await prisma.availability.findMany({ where: { technicianId: id, ...(date && {date:new Date(date) }) } })
     return results
   }

   async updateAvabiltilyDB(payload:IAvailability,userId:string){
      const technichianProfile=await prisma.technicianProfile.findUnique({where:{userId}})
     if(!technichianProfile){
       throw new Error('Technician profile not found')
     }
     console.log('payload avalibilty',payload)
    const {id,isAvailable,isBooked}=payload
    

      const result=await prisma.availability.update({where:{id}, data:{isAvailable,isBooked}})
      return result
   }
}

export default new TecnichianService();
