import express, { Application, Request, Response } from "express"
import cors from "cors"


import cookieParser from "cookie-parser"
import config from './config/config'

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



export default app