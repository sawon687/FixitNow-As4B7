class PaymentService {
    paymentCreateDB(){
         const booking = await prisma.booking.findUniqueOrThrow({
  where: {
    id: bookingId
  }
});

if (booking.status !== "ACCEPTED") {
  throw new Error("Payment is only available for accepted bookings");
}

const paymentIntent = await stripe.paymentIntents.create({
  amount: booking.totalAmount * 100,
  currency: "usd",
  metadata: {
    bookingId: booking.id
  }
});
    }
}

export default new PaymentService()