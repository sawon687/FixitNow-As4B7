import { BookingStatus } from '../../../generated/prisma/enums'

export interface ITecnichianProfile {
     userId:string
      yearsOfExperience:number,
     bio: string,
     skills: string[],
     location:string

}

export interface  IAvailability {  
  date:Date
  startTime:string 
  endTime:string

}

export interface IBookingStatus{
     status: BookingStatus
}
export interface IQuery {
     date?:Date
}

export interface IAvailability{
      id:string
      isAvailable: boolean,
      isBooked:boolean,
}
