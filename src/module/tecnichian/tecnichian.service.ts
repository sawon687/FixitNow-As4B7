import { TechnicianProfile } from '../../../generated/prisma/client';
import { AvailabilityStatus, BookingStatus, PaymentStatus } from '../../../generated/prisma/enums';
import { prisma } from "../../lib/prisma";
import {  IAvailability, IAvailabilityUpdateStatus, IBookingStatus, IQuery, ITecnichianProfile } from "./tecnichian.interface";

class TecnichianService {
  async profiledb(payload: ITecnichianProfile) {
    const { userId, bio, skills, location, yearsOfExperience } = payload;

    const profileExits = await prisma.technicianProfile.findUnique({
      where: { userId },
    });
    if (profileExits) {
      throw new Error("This id profile allready exits");
    }

    const result = await prisma.technicianProfile.create({
      data: {
        userId,
        bio,
        skills,
        location,
        yearsOfExperience,
      },
    });

 

      return result;
    }
  


    async updateprofiledb(payload: ITecnichianProfile) {
    const { userId, bio, skills, location, yearsOfExperience} = payload;

    const profileExits = await prisma.technicianProfile.findUnique({
      where: {userId },
    });
    if (!profileExits) {
      throw new Error("This  profile not exits");
    }

    const result = await prisma.technicianProfile.update({where:{id:profileExits.id},
      data: {
        userId,
        bio,
        skills,
        location,
        yearsOfExperience,
      },
    });

   

      return result;
    }

  async getAlltecnichiandb(query: any) {
  const {
    location,
    skills,
    yearsOfExperience,
  } = query;

  const results = await prisma.technicianProfile.findMany({
    where: {
      ...(location && {
        location: {
          contains: location,
          mode: "insensitive",
        },
      }),

      ...(skills && {
        skills: {
          has: skills,
        },
      }),

   

      ...(yearsOfExperience && {
        yearsOfExperience:  Number(yearsOfExperience),
    
      }),
    },

    include: {
      reviews: true,
      bookings: true,
      availabilities: true,
      technician: true,
    },
  });

  return results;
}


async gettecnichianDashboarddb(userId:string) {
const technichianexits=await prisma.technicianProfile.findUnique({where:{userId}})
if(!technichianexits)
{
   throw new Error ('Tecnishan not Found!Pleace create your tecnishian account')
}

 const now = new Date();



  const currentYear = now.getFullYear();
  const [totalRevunue,reqBookingCount,completeBooking,avalibileBookingCount,booking]=await Promise.all([
        prisma.payment.aggregate({where:{
          status:PaymentStatus.PAID, 
          booking:{
            technicianId:technichianexits.id
          }
        },
         _sum:{
           amount:true
         }
        
      }),
      prisma.booking.count({where:{technicianId:technichianexits.id,status:BookingStatus.REQUESTED}}),
      prisma.booking.count({where:{technicianId:technichianexits.id,status:BookingStatus.COMPLETED}}),
      prisma.availability.count({where:{technicianId:technichianexits.id,status:AvailabilityStatus.Available}}),
      prisma.booking.findMany({where:{
        technicianId:technichianexits?.id,

      },
      include:{
        customer:{
          select:{
            name:true
          }
        },
        service:{
          include:{
            category:{
              select:{
                 name:true
              }
            }
          }
        }
      },
      orderBy:{
        createdAt:"desc"
      }
    })

  
  ])

  
  const revenueData = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const monthStart = new Date(
        currentYear,
        i,
        1
      );

      const monthEnd = new Date(
        currentYear,
        i + 1,
        1
      );

      const result = await prisma.payment.aggregate({
        where: {
          status: PaymentStatus.PAID,
          booking:{
            technicianId:technichianexits?.id
          },
          paidAt: {
            gte: monthStart,
            lt: monthEnd,
          },
        },
        _sum: {
          amount: true,
        },
      });

      return {
        month: monthStart.toLocaleString("en-US", {
          month: "short",
        }),
        revenue: result._sum.amount ?? 0,
      };
    })
  );
  
  return{
  revenueData,
  totalRevunue,
  reqBookingCount,
  completeBooking,
  booking,
  avalibileBookingCount
  }

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

     async getMyServicedb(userId:string){
    const  technicianProfile=await prisma.technicianProfile.findUnique({where:{userId}})
  
    if(!technicianProfile)
    {
       throw new Error('This tecnishian not found pleace create  tecnishian')
    }
   
      const results=await prisma.service.findMany({where:{technicianId:technicianProfile.id}})
      return results
   }

  async getAvabilityDB(userId:string,query:IQuery){
  
     const technichianProfile=await prisma.technicianProfile.findUnique({where:{userId}})
     if(!technichianProfile){
       throw new Error('Technician profile not found')
     }

     const { id } = technichianProfile;
   
     const results = await prisma.availability.findMany({
       where: {
         technicianId: id,
        },
     });
     return results
   }

    async getAvableSlotDB(date:string){
     const results = await prisma.availability.findMany({
       where: {
          date
          
        },
        
             select: {
           id: true,
           startTime: true,
           endTime: true
        }
     });
     return results
   }

   async updateAvabiltilyDB(payload:IAvailabilityUpdateStatus,userId:string){
      const technichianProfile=await prisma.technicianProfile.findUnique({where:{userId}})
     if(!technichianProfile){
       throw new Error('Technician profile not found')
     }
     console.log('payload avalibilty',payload)
    const {id,status}=payload
    

      const result=await prisma.availability.update({where:{id}, data:{status}})
      return result
   }
}

export default new TecnichianService();
