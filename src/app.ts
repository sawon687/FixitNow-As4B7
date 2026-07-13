import express, { Application, Request, Response } from "express"
import cors from "cors"


import cookieParser from "cookie-parser"
import config from './config/config'
import { authRouter } from './module/auth/auth.route'
import { technicianRouter } from './module/tecnichian/tecnichian.route'
import { adminroutes } from './module/admin/admin.route'

const app:Application=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:config.appurl,
    credentials:true
}))
app.get('/',(req:Request,res:Response)=>{
    res.send('bloghun prisma project')
})

app.use('/api/auth',authRouter)
app.use('/api/technician',technicianRouter)
app.use('/api/admin',adminroutes)


export default app