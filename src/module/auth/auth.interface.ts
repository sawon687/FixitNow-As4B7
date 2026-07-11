import { Role } from '../../../generated/prisma/enums';


export interface IAuth {
    name: string,
    email: string,
    password: string,
    role:Role

}

export interface ILogin{
    email:string,
    password:string
}