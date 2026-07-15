import { prisma } from '../../lib/prisma';
import { IService } from './service.interface';


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

  async getServicedb(){
    const results=await prisma.service.findMany()
    return results
  }
}

export default  new ServicesService()