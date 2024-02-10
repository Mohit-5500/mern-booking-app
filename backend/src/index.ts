import express,{Request,Response} from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"
import userRoutes from "./routes/users"
import authRoutes from "./routes/auth"
import cookieParser from "cookie-parser"
import myHotelRoutes from "./routes/my-hotels"
import path from "path"
import {v2 as cloudinary} from "cloudinary"
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_CLOUD_API,
    api_secret:process.env.CLOUDINARY_CLOUD_SECRET
})
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
const app=express()
app.use(express.static(path.join(__dirname,"../../frontend/dist")))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({origin:"http://localhost:5173",credentials:true}))

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/my-hotels",myHotelRoutes)
app.get("*",(req:Request,res:Response)=>{
    res.sendFile(path.join(__dirname,"../../frontend/dist/index.html"))
})

app.listen(7000,()=>{
    console.log("Server is running on the port 7000")
})