import { BookingStatus, PaymentStatus } from '../../../generated/prisma/enums'
import { prisma } from '../../lib/prisma'

class CustomerService{
    async getCustomerDashboardDB(userId:string) {
        
        const [totalBookingCount,activeBookingCount,totalCompletedCount,
            paymentPaid,bookingInfo,pendingAmount,
            cancelledPayment,review]=await Promise.all([
                //  total Booking Count
            prisma.booking.count({where:{
                userId
            }}),
                      // active Booking Count
            prisma.booking.count({where:{ userId,
               status:{
                in:[
                    BookingStatus.REQUESTED,
                    BookingStatus.ACCEPTED,
                    BookingStatus.IN_PROGRESS
                ]
               }
            }}),

            prisma.booking.count({where:{
                userId,
                status:BookingStatus.COMPLETED   
            }}),

            prisma.payment.aggregate({where:{
               customerId:userId, 
               status:PaymentStatus.PAID
            },
            _sum:{
                amount:true||0
            },
             _count:true||0

        }),

     
 prisma.booking.findMany({
  where: {
    userId,
  },

  include: {
    service: {
      select: {
        title: true,
      },
    },

    technician: {
      select: {
        skills: true,

        users:true
      },
    },
  },

  orderBy: {
    createdAt: "desc",
  },

  take: 3,
}),
        prisma.payment.aggregate({where:{customerId:userId,status:PaymentStatus.PENDING},
         _sum:{
            amount:true||0
         },
         _count:true||0
        
        }),

        prisma.payment.aggregate({where:{customerId:userId,status:PaymentStatus.CANCELLED},_sum:{
            amount:true
        },
        _count:true
    }),

      prisma.review.findMany({where:{userId,

      },
      include:{
        customer:true,
        technician:{
          include:{
            users:true
          }
        }
      },
    
        orderBy:{
            createdAt:'desc'
        },
        take:2
    })

        ])

        return {
            totalBookingCount,
            activeBookingCount,
              paymentPaid,
           totalCompletedCount,
            bookingInfo,
            pendingAmount,
            cancelledPayment,
            review
        }
    }
}


export default new CustomerService()