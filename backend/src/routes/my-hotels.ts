import express,{Request,Response} from "express"
import multer from "multer"
import cloudinary from "cloudinary"
import { hotelType } from "../models/hotel"
import Hotel from "../models/hotel"
import verifyToken from "../middlewares/auth"
import { body } from "express-validator"
const router=express.Router()

const storage=multer.memoryStorage()
const upload=multer({
    storage:storage,
    limits:{
        fileSize:5*1024*1024
    }
})

router.post("/",verifyToken,[
    body("name").notEmpty().withMessage("Name is Required"),
    body("city").notEmpty().withMessage("City is Required"),
    body("country").notEmpty().withMessage("Country is Required"),
    body("description").notEmpty().withMessage("Description is Required"),
    body("type").notEmpty().withMessage("Hotel Type is Required"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Price Per Night is Required"),
    body("facilities").notEmpty().isArray().withMessage("Name is Required"),
   
    
],upload.array("imageFiles",6),async(req:Request,res:Response)=>{
    try{
        //image will be 
        const imageFiles=req.files as Express.Multer.File[]
        const newHotel:hotelType=req.body
        //1.upload files to cloudinary
        const uploadPromises=imageFiles.map(async(image)=>{
            const b64=Buffer.from(image.buffer).toString("base64")
            let dataURI="data:"+image.mimetype+";base64,"+b64
            const res=await cloudinary.v2.uploader.upload(dataURI)
            return res.url
        })
        const imageURLS=await Promise.all(uploadPromises)

        //2.if upload was successfull ad the urls to database
        newHotel.imageUrls=imageURLS
        newHotel.lastUpdated=new Date()
        newHotel.userId=req.userId
        
        //3.save the new hotel into our database
        const hotel=new Hotel(newHotel)
        await hotel.save()
        //4.return a 201 status
        return res.status(201).send(hotel)
    }
    catch(error){
        console.log("Error during creating hotel:",error)
        return res.status(500).json({message:"Something went wrong"})
    }
})
export default router