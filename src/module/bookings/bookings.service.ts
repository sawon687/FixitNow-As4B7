import { prisma } from '../../lib/prisma';
import { ICreateBookingDTO } from './bookings.interface';

class BookingsService{
      async createBookings(payload: ICreateBookingDTO){
         const{userId,technicianId,serviceId,totalAmount,address,scheduledDate}=payload
         console.log('payload bookings',payload)
         const results = await prisma.booking.create({ data:{
            userId,
            technicianId,
            serviceId,
            totalAmount,
            address,
            scheduledDate,

         } })
         return results
   }
}


export default new BookingsService()