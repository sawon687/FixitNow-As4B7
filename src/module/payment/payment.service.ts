

import { promise } from 'zod';
import { PaymentStatus } from '../../../generated/prisma/enums';
import config from '../../config/config';
import { prisma } from '../../lib/prisma';
import { stripe } from '../../lib/stripe';
import { ICustomer } from './payment.interface';

class PaymentService {
  // create payment 
  async paymentCreateDB(bookingId: string, user: ICustomer) {
    console.log('bookingsId',bookingId)
    const booking = await prisma.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
    });

    // only customer can make payment
    if (user.role !== "CUSTOMER") {
      throw new Error("Only customers can make payment");
    }

    // payment only for accepted booking
    if (booking.status !== "ACCEPTED") {
      throw new Error(
        "Payment is only available for accepted bookings"
      );
    }

    // create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "FixItNow Service Booking",
            },
            unit_amount: Math.round(booking.totalAmount * 120),
          },
          quantity: 1,
        },
      ],

      customer_email: user.email,

      metadata: {
        bookingId: booking.id,
        customerId: user.id,
      },

      success_url: `${config.appurl}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,

      cancel_url: `${config.appurl}/payment/cancel?sessionId={CHECKOUT_SESSION_ID}`,
    });

    // create payment record
  const payment = await prisma.payment.upsert({
  where: {
    bookingId: booking.id,
  },

  update: {
    transactionId: session.id,
    status: "PENDING",
  },

  create: {
    transactionId: session.id,
    bookingId: booking.id,
    customerId: user.id,
    amount: booking.totalAmount,
    method:"Strip",
    status: "PENDING"
  },
}); 

    return {
     
      sessionId: session.id,
      paymentUrl: session.url,
    };
  }

  async confrimpaymentDB(sessionId:string){
       console.log('session',sessionId)
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new Error("Checkout session not found");
  }

  const exitingPayment=await prisma.payment.findUnique({
    where:{transactionId:session.id}
  })


  if (session.payment_status !== "paid") {
      if(exitingPayment?.status===PaymentStatus.CANCELLED)
      {
           return exitingPayment
      } 
        const payment = await prisma.payment.update({
           where: {
      transactionId: session.id,
          },
           data: {
      status: PaymentStatus.CANCELLED ,
      paidAt:new Date()
        },
          });
      return payment
   
  }

  const payment = await prisma.payment.update({
    where: {
      transactionId: session.id,
    },
    data: {
      status: PaymentStatus.PAID ,
      paidAt:new Date()
    },
  });

  return payment;

  }

 async userPaymentGetDB(id: string) {
  if (!id) {
    throw new Error("Please login to view payment history");
  }

  const userPaymentDetails = prisma.payment.findMany({
    where: {
      customerId: id,
    },
    include: {
      booking: {
       select:{
        service:{
          select:{
            title:true
          }
        }
       }
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPaidUser = prisma.payment.count({
    where: { customerId: id, status: PaymentStatus.PAID },
  });

  const totalPendingUser = prisma.payment.count({
    where: { customerId: id, status: PaymentStatus.PENDING },
  });
  const totalPayment=prisma.payment.aggregate({where:{customerId:id,},_sum:{
         amount:true
  }})

  const [paidCount, pendingCount, payments,totalPaid] = await Promise.all([
    totalPaidUser,
    totalPendingUser,
    userPaymentDetails,
    totalPayment
  ]);

  return {
    paidCount,
    pendingCount,
    payments,
    totalPaid:totalPaid._sum.amount
  };
}
  async singlePaymentHistoryDB(id:string){
     const result =await prisma.payment.findFirstOrThrow({where:{id},include:{
       booking:true
     }})
     return result
  }

}

export default new PaymentService();
