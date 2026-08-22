
import config from '../../config/config';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { IAuth, ILogin } from './auth.interface';
import { jwtUtils } from '../../utils/jwt';
import { SignOptions } from 'jsonwebtoken';

class AuthService {
   async createdb(payload:IAuth){
         {
        const { email, password ,name,role,profilePhoto} = payload
     
        
        const userexits = await prisma.users.findUnique({ where: { email } })
        if (userexits) {
            throw new Error('This email Allready exits')
        }
        const hashedPassword = await bcrypt.hash(password, Number(config.bycriptHashRound))
      
        const user = await prisma.users.create({ data:{
            email,
            password: hashedPassword,
            name,
            role,
            profilePhoto

        },
    omit:{password:true}})
       
        return user
    }
    }

    async logindb(payload:ILogin){
           const{email,password}=payload
        const userExits=await prisma.users.findUnique({where:{email}})
        if(userExits?.status==='BAN')
        {
             throw new Error("This user is Ban ! pleace try again")
        }
        if(!userExits)
        {
            throw new Error('This email is not found')
        }

        const passwordMatch=await bcrypt.compare(password,userExits.password)
        console.log('password',passwordMatch)

        if(!passwordMatch)
        {
             throw new Error('password does not match! please try again')
        }

        const jwtpayload={
            id:userExits.id,
            name:userExits.name,
            email:userExits.email,
            role:userExits.role
            
        }
        
        const accessToken=jwtUtils.createToken(jwtpayload,config.accessSecret,{expiresIn:config.jwt_refresh_Expires}as SignOptions)
        const refreshToken=jwtUtils.createToken(jwtpayload,config.refreshSecret,{expiresIn:config.jwt_refresh_Expires} as SignOptions)

          
        return {accessToken,refreshToken,role:userExits.role}
    }

   async meDB(payload:{id:string}&IAuth){
      const {id,email,role,name}=payload
     const result=await prisma.users.findUnique({where:{
        id,
        email,
        name,
        role
     },
     omit:{password:true},
     include:{technicianProfile:true}
    })
     return result
   }
}

export default new AuthService()