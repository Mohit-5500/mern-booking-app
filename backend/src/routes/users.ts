import {Request,Response} from "express"
import express from "express"
import User from "../models/user"
import jwt from "jsonwebtoken"
import "dotenv/config"
import {check, validationResult} from "express-validator"
const router=express.Router()

router.post("/register",[
    check("firstName","First Name is required").isString(),
    check("lastName","Last Name is required").isString(),
    check("email","Email is required").isEmail(),
    check("password","Password With 6 or more characters is required").isLength({min:6}),
],async (req:Request,res:Response)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.array})
    }
    try{
        //fething data from frontend
        let user=await User.findOne({
            email:req.body.email
        })
        //if user fond

        if(user){
            return res.status(400).json({message:"User already Exist"})
        }
        //if user does not found that measn it is a new user.password has been hashed
        user=new User(req.body)
        await user.save()

        //creating a jsonweb token
        const token=jwt.sign({userId:user.id},process.env.JWT_SECRET as string,{expiresIn:"1d"})

        //sending with cookie
        res.cookie("auth_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            maxAge:86400000
        })
        return res.status(200).send({message:"User Registration ok"})
    }
    catch(error){
        console.log(error)
        res.status(500).send({message:"Something Went Wrong due to internal server error"})

    }
})
export default router