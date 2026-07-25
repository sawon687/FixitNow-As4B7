import express, { Application, Request, Response } from "express"
import cors from "cors"


import cookieParser from "cookie-parser"
import config from './config/config'
import { authRouter } from './module/auth/auth.route'
import { technicianRouter } from './module/tecnichian/tecnichian.route'
import { adminroutes } from './module/admin/admin.route'
import { bookingsrouter } from './module/bookings/bookings.route'
import { serviceRouter } from './module/service/service.route'

import { reviewRouter } from './module/review/review.route'
import { paymentrouter } from './module/payment/payment.route'

const app:Application=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:config.appurl,
    credentials:true
}))
app.get('/',(req:Request,res:Response)=>{
    res.send('Fixit prisma project')
})

app.use('/api/auth',authRouter)
app.use('/api/technician',technicianRouter)
app.use('/api',serviceRouter)
app.use('/api/admin',adminroutes)
app.use('/api/bookings',bookingsrouter)
app.use('/api/payments',paymentrouter)
app.use('/api/reviews',reviewRouter)

export default app