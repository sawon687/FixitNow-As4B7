
import {
  BookingStatus,
  BookingWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ICreateBookingDTO } from "./bookings.interface";

class BookingsService {
  async createBookings(payload: ICreateBookingDTO) {
    const {
      userId,
      technicianId,
      serviceId,
      totalAmount,
      address,
      scheduledDate,
      startTime,
    } = payload;
    console.log("payload bookings", payload);
    const results = await prisma.booking.create({
      data: {
        userId,
        technicianId,
        serviceId,
        totalAmount,
        address,
        startTime,
        scheduledDate,
      },
    });
    return results;
  }
  async getMyBokingsdb(userId: string, status: string) {
    const whereCondition: BookingWhereInput = { userId };

    if (status &&  status!=="undefined" && status!=="ALL") {
      whereCondition.status = { equals: status as BookingStatus };
    }
    console.log("conditon", whereCondition);
    const results = await prisma.booking.findMany({
      where: whereCondition,
      include: { review: true, payment: true },
    });
    console.log("bookns", results);
    return results;
  }

  async getsingleBokingsdb(id: string) {
    const results = await prisma.booking.findUniqueOrThrow({
      where: { id },
      include: {
        payment: true,
        
        technician: {
           
          include: {
            users: {
              
              select: {
                name:true,
                email:true
              },
            },
          },
        },
        review: true,
      },
    });
    return results;
  }
}

export default new BookingsService();
