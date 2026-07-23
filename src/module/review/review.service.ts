import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReview } from "./review.interface";

class ReviewService {
  // Created Review
  async createReviewDB(payload: IReview, role: Role) {
    const { bookingId } = payload;

    const bookingExists = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!bookingExists) {
      throw new Error("This booking does not exit");
    }

    if (bookingExists.status !== BookingStatus.COMPLETED) {
      throw new Error("This booking does not Completed!");
    }

    const reviewPaylod = {
      ...payload,
      technicianId: bookingExists.technicianId,
    };

    const result = await prisma.review.create({ data: reviewPaylod });

    return result;
  }
}

export default new ReviewService();
