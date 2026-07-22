import config from '../config/config';
import { prisma } from '../lib/prisma';
import { stripe } from '../lib/stripe';
import { ICustomer } from './payment.interface';


class PaymentService {
  async paymentCreateDB(bookingId: string, user: ICustomer) {
    console.log('bookingsId',bookingId)
    const booking = await prisma.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
    });

    // Only customer can make payment
    if (user.role !== "CUSTOMER") {
      throw new Error("Only customers can make payment");
    }

    // Payment only for accepted booking
    if (booking.status !== "ACCEPTED") {
      throw new Error(
        "Payment is only available for accepted bookings"
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "FixItNow Service Booking",
            },
            unit_amount: Math.round(booking.totalAmount),
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

    // Create payment record
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
}

export default new PaymentService();
