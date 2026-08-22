import status from 'http-status';
import {
  
  BookingStatus,
  CategoryStatus,
  PaymentStatus,
  Role,
  UserStatus,
} from "../../../generated/prisma/enums";
import {
  CategoryWhereInput,
  UsersFindUniqueArgs,
  UsersWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ICategory } from "./admin.interface";
export type IQuery = {
  search: string;
  page: string;
};
class AdminService {
  async categoryCreatedb(payload: ICategory) {
    const result = await prisma.category.create({ data: payload });
    return result;
  }
async getAllCategorydb(search: string) {
    const whereCondition:CategoryWhereInput = {}; // অথবা CategoryWhereInput
    const normalizedSearch =
      typeof search === "string" && search !== "undefined" ? search.trim() : "";

    if (normalizedSearch) {
      whereCondition.OR = [
        {
          name: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
   
        {
          description: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
      ];
    }

    const [allcategory, totalCategoryCount, activeCategoryCount, inactiveCategoryCount] =
      await Promise.all([
        prisma.category.findMany({
          where: whereCondition,
          include: {
            _count: {
              select: {
                services: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.category.count(), 
        prisma.category.count({ where: { status: CategoryStatus.ACTIVE } }), 
        prisma.category.count({ where: { status: CategoryStatus.INACTIVE } }), 
      ]);


    return {
      allcategory,
      totalCategoryCount,
      activeCategoryCount,
      inactiveCategoryCount,
    };
  }

    async updatecategoreydb(payload:CategoryStatus,id:string) {
       
    const result = await prisma.category.update({ where:{id}, data: payload });
    return result;
  }
     async deletecategoreydb(id:string) {
       
    const result = await prisma.category.delete({ where:{id} });
    return result;
  }
  async getAllUsersdb(query: IQuery) {
    const { search, page } = query;
    console.log("searach", search, "page", page);
    const whereCondition: UsersWhereInput = {};
    const normalizedPage =
      typeof page === "string" && page !== "undefined" ? Number(page) : 1;
    const normalizedSearch =
      typeof search === "string" && search !== "undefined" ? search.trim() : "";

    if (normalizedSearch) {
      whereCondition.OR = [
        {
          name: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
      ];

      const roleValue = normalizedSearch.toUpperCase();

      if (
        roleValue === "ADMIN" ||
        roleValue === "CUSTOMER" ||
        roleValue === "TECHNICIAN"
      ) {
        whereCondition.OR.push({
          role: roleValue as Role,
        });
      }
    }

    const limit = 6;
    const pageNumber = Number(normalizedPage) || 1;
    const skip = (pageNumber - 1) * limit;

    const [users, totalUserCount] = await Promise.all([
      prisma.users.findMany({
        where: whereCondition,
        skip,
        take: limit,
      }),
      prisma.users.count({ where: whereCondition }),
    ]);

    return { users, totalUserCount, pageNumber, limit };
  }

  async getAdminDashboarddb() {
  const now = new Date();

  // Current month
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const currentYear = now.getFullYear();

  // Dashboard data
  const [
    totalUser,
    registerUser,
    totaltechnician,
    runingMonthBooking,
    activeBookingCount,
    bookingAll,
    revenueResult,
  ] = await Promise.all([
    // Total users
    prisma.users.count(),

    // Total customers
    prisma.users.count({
      where: {
        role: Role.CUSTOMER,
      },
    }),

    // Total technicians
    prisma.technicianProfile.count(),

    // Current month bookings
    prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
    }),

    // Active bookings
    prisma.booking.count({
      where: {
        status: {
          in: [
            BookingStatus.REQUESTED,
            BookingStatus.ACCEPTED,
            BookingStatus.IN_PROGRESS,
          ],
        },
      },
    }),

    // Active booking list
    prisma.booking.findMany({
      where: {
        status: {
          in: [
            BookingStatus.REQUESTED,
            BookingStatus.ACCEPTED,
            BookingStatus.IN_PROGRESS,
          ],
        },
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
        service: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    // Total revenue
    prisma.payment.aggregate({
      where: {
        status: PaymentStatus.PAID,
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  // Total revenue
  const revenue = revenueResult._sum.amount ?? 0;


  // Monthly Revenue


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

  return {
    totalUser,
    activeBookingCount,
    revenue,
    bookingAll,
    registerUser,
    totaltechnician,
    runingMonthBooking,
    revenueData,
  };
}

  async getAllBookingsdb() {
    const result = await prisma.booking.findMany();
    return result;
  }
  async updateUserStatusDB(status: UserStatus, id: string) {
    const result = await prisma.users.update({
      where: { id },
      data: { status },
    });
    return result;
  }
}

export default new AdminService();
