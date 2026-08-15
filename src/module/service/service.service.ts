import { constants } from "node:buffer";
import { Service } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IService, IServiceQuery } from "./service.interface";

class ServicesService {
  async createServicedb(payload: IService, userId: string) {
    const { title, description, price, priceType, location } = payload;
    const technicianProfileExits = await prisma.technicianProfile.findUnique({
      where: { userId },
    });
    if (!technicianProfileExits) {
      throw new Error(
        "tecnician profile is not found! pleace techchian profile updated",
      );
    }

    const technicianId = String(technicianProfileExits.id);
    const categoryId = String(payload.categoryId);
    const results = await prisma.service.create({
      data: {
        title,
        technicianId,
        categoryId,
        description,
        price,
        priceType,
        userId,
      },
    });
    console.log("service results", results);
    return results;
  }

  async getAllServices(query: IServiceQuery) {
    const { category, location, rating, price } = query;

    const results = await prisma.service.findMany({
      where: {
        isActive: true,

        ...(category && {
          category: {
            name: {
              contains: category,
              mode: "insensitive",
            },
          },
        }),

        ...(price && {
          name: {
            constants: price,
          },
        }),
        ...(location && {
          technician: {
            location: {
              contains: location,
              mode: "insensitive",
            },
          },
        }),

        ...(rating && {
          technician: {
            avgRating: Number(rating),
          },
        }),
      },

      include: {
        category: true,
        technician: true,
      },
    });

    return results;
  }

  async getsingleServicedb(id: string) {
    const results = await prisma.service.findUniqueOrThrow({
      where: { id },
      include: {
        technician:{
          include:{
            technician:true,
            availabilities:true
          }
        },
      },
    });
    return results;
  }
}

export default new ServicesService();
