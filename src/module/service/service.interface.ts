export interface IService {
     technicianId: String 
   categoryId:   String
    title: string
    description: string
    price:number
    priceType: string
    location: string
}

export interface IServiceQuery {
  type?: string;
  location?: string;
  rating?: string;
}