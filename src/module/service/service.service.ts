import { Service } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { IService, IServiceQuery } from './service.interface';


class ServicesService {
    async createServicedb(payload: IService,userId:string) {

    const { title, description, price, priceType, location } =payload;
     const technicianProfileExits=await prisma.technicianProfile.findUnique({where:{userId}})
     if(!technicianProfileExits){
        throw new Error('tecnician profile is not found! pleace techchian profile updated')
     }

    const technicianId = String(technicianProfileExits.id);
    const categoryId=String(payload.categoryId)
    const results = await prisma.service.create({
      data: {
        title,
        technicianId,
        categoryId,
        description,
        price,
        priceType,
        location,
      },
    });
    console.log("service results", results);
    return results;
  }

async getAllServices(query:IServiceQuery) {
  const { type, location,  rating } = query;

  const results = await prisma.service.findMany({
    where: {
      isActive: true,

   
      ...(type && {
        category: {
          name: {
            contains: type,
            mode: "insensitive",
          },
        },
      }),

  
      ...(location && {
          technician:{
             location: {
          contains: location,
          mode: "insensitive",
        },
          }
      }),

      
      ...(rating && {
        technician: {
          avgRating: Number(rating),
        
        },
      }),
    },

    include: {
      category: true,

      technician: {
        include: {
          technician: true,
        },
      },
    },
  });

  return results;
}
}

export default  new ServicesService()