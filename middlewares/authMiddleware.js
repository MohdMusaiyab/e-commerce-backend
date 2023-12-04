import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
//Protected  Routes Token Base
 export const requireSignIn= async (req,res, next)=>{
    try{        
            const decode = JWT.verify(
                req.headers.authorization,
                // req.headers["authorization"],
                process.env.JWT_SECRET
            )

            req.user=decode;
            next();
    }
    catch(error)
    {   
        return res.status(401).send({
            success:false,
            message:"Error in Auth Middleware",
        })
    }
 }

 //Now for admin Interface

 export const isAdmin = async(req,res,next)=>{
    try{
        const user=await userModel.findById(req.user._id);
        if (!user) {
            // User not found in the database
            return res.status(404).send({
              success: false,
              ok: false,
              message: "User not found",
            });
          }
        if(user.role!=1)
        {
        
            return res.status(404).send({
                success:false,
                ok : false,
                message:"Unauthorised Access",
            })
        
        }
        else{
            next();
        }
    }
    catch(error)
    {
        return res.status(401).send({
            success:false,
            message:"Error in Admin Midlleare",
        })
    }
 }
