import { constants } from "node:buffer";
import { Service } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IService, IServiceQuery } from "./service.interface";
import { ServiceWhereInput } from '../../../generated/prisma/models';

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
  const {
    category,
    location,
    rating,
    price,
    search,
    page,
  } = query;

  const whereQuery: ServiceWhereInput = {};

  const normalization = search?.trim() ?? "";
  const normalizationCategory = category?.trim() ?? "";
  const normalizationLocation = location?.trim() ?? "";

  const normalizationRating = rating
    ? Number(rating)
    : undefined;

  const normalizationPrice = price
    ? Number(price)
    : undefined;

  // =========================
  // SEARCH
  // =========================

  if (normalization) {
    whereQuery.OR = [
      {
        title: {
          contains: normalization,
          mode: "insensitive",
        },
      },

      {
        description: {
          contains: normalization,
          mode: "insensitive",
        },
      },

      {
        technician: {
          users: {
            name: {
              contains: normalization,
              mode: "insensitive",
            },
          },
        },
      },

      {
        technician: {
          skills: {
            has: normalization,
          },
        },
      },
    ];
  }

  // =========================
  // CATEGORY
  // =========================

  if (
    normalizationCategory &&
    normalizationCategory !== "All"
  ) {
    whereQuery.category = {
      name: {
        contains: normalizationCategory,
        mode: "insensitive",
      },
    };
  }

  // =========================
  // LOCATION
  // =========================

  if (
    normalizationLocation &&
    normalizationLocation !== "All"
  ) {
    whereQuery.technician = {
      location: {
        contains: normalizationLocation,
        mode: "insensitive",
      },
    };
  }

  // =========================
  // PRICE
  // =========================

  if (
    normalizationPrice !== undefined &&
    !Number.isNaN(normalizationPrice)
  ) {
    whereQuery.price = {
      gte: normalizationPrice,
    };
  }

  // =========================
  // RATING
  // =========================

  if (
    normalizationRating !== undefined &&
    !Number.isNaN(normalizationRating)
  ) {
    whereQuery.technician = {
      avgRating: {
        gte: normalizationRating,
      },
    };
  }

  // =========================
  // PAGINATION
  // =========================

  const limit = 6;

  const currentPage = Math.max(
    Number(page) || 1,
    1
  );

  const skip = (currentPage - 1) * limit;

  // =========================
  // DATABASE
  // =========================

  const [
    totalserviceCount,
    serviceInfo,
    availableLocations,
  ] = await Promise.all([
    prisma.service.count({
      where: whereQuery,
    }),

    prisma.service.findMany({
      where: whereQuery,

      include: {
        technician: true,
        category: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: limit,
    }),

    prisma.technicianProfile.findMany({
      select: {
        location: true,
      },

      distinct: ["location"],
    }),
  ]);

  const totalpage = Math.ceil(
    totalserviceCount / limit
  );

  return {
    totalpage,
    serviceInfo,
    locations: availableLocations,
  };
}

  async getsingleServicedb(id: string) {
    const results = await prisma.service.findUniqueOrThrow({
      where: { id },
      include: {
        technician:{
          include:{
            users:true,
            availabilities:true
          }
        },
      },
    });
    return results;
  }
}

export default new ServicesService();
