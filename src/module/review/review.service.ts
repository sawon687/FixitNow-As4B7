import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReview } from "./review.interface";

class ReviewService {
  // Created Review
async createReviewDB(payload: IReview, role: Role) {
  const { bookingId,technicianId,comment,userId,rating } = payload;

console.log('review',payload)
  const bookingExists = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!bookingExists) {
    throw new Error("This booking does not exist");
  }

 
  if (bookingExists.status !== BookingStatus.COMPLETED) {
    throw new Error("This booking is not completed!");
  }


const result = await prisma.review.create({
  data: {
    rating,
    comment,
    bookingId,
    userId,
    technicianId:technicianId || bookingExists.technicianId
  }
});


  const ratingResult = await prisma.review.aggregate({
    where: {
      technicianId: bookingExists.technicianId,
    },
    _avg: {
      rating: true,
    },
  });

 
  await prisma.technicianProfile.update({
    where: {
      id: bookingExists.technicianId,
    },
    data: {
      avgRating: Number(ratingResult._avg.rating?.toFixed(1)) ?? 0,
    },
  });

  return result;
}
}

export default new ReviewService();
