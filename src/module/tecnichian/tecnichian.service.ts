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
}

export default new TecnichianService();
