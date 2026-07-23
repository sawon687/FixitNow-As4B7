import { Role } from '../../../generated/prisma/enums';


export interface ICustomer{
    id:string,
    name:string,
    role:Role,
    email:string
}


