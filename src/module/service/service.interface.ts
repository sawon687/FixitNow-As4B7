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
  category?: string;
  location?: string;
  rating?: string;
  price?:string,
  search?:string
}