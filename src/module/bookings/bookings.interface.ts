

export interface ICreateBookingDTO {
  userId:string
  serviceId: string;
  technicianId: string;
  scheduledDate: string;   // ISO date string, frontend থেকে string আসবে
  address: string;
  totalAmount: number;
}