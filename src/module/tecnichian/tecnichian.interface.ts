
export interface ITecnichianProfile {
     userId:string
      yearsOfExperience:number,
     bio: string,
     skills: string[],
     location:string

}
export interface IService {
     technicianId: String 
  categoryId:   String
    title: string
    description: string
    price:number
    priceType: string
    location: string
}