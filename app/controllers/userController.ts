import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../Interface/Response";
import { Executor } from "../../Interface/Executor";
import { User } from "../../Interface/mongoose/User";
import UserModel from "../models/User";
import { v4 } from "uuid";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const signup = (req:Request,res:Response):void =>{
    (async ()=> {

        try{

            const { name, email, password } = req.body;

            if(!name || !email || !password){
                throw new Error("Not all required parameters are provided");
            } else if(!emailRegex.test(email)){
                throw new Error("Invalid email");
            }
    
            const user:User = new UserModel({
                userId: v4(),
                name,
                email,
                password
            });
    
            await user.save();
            const response:SuccessResponse<string> = {
                status: "success",
                data: "User registered"
            }
            res.send(response);

        } catch (e){

            const response: ErrorResponse = {
                status: "error",
                message: e.message
            }
            res.send(response);
            
        }
    })()
    
}
