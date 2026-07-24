

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

      success_url: `${config.appurl}/payment?success=true`,

      cancel_url: `${config.appurl}/payment?success=false`,
    });

    // create payment record
    const payment = await prisma.payment.create({
      data: {
        transactionId: session.id,
        bookingId: booking.id,
        customerId: user.id,
        amount: booking.totalAmount,
        status: "PENDING",
      },
    });

    return {
      payment,
      sessionId: session.id,
      paymentUrl: session.url,
    };
  }

  async confrimpaymentDB(sessionId:string){
       
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new Error("Checkout session not found");
  }

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
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

  async userPaymentGetDB(id: string){
     
    const result = await prisma.payment.findMany({
      where: { customerId: id },
      orderBy:{createdAt:'desc'}
    });
    return result;
  }
}

export default new PaymentService();
