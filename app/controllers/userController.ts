import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../Interface/Response";
import CustomError from "../../Class/CustomError";
import { User } from "../../Interface/mongoose/User";
import UserModel from "../models/User";
import { v4 } from "uuid";
import response from "../utils/response";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const signup = async (req:Request,res:Response):Promise<any> =>{

    try{

        let { name, email, password } = req.body;

        if(!name || !email || !password){
            throw new CustomError("All fields are required");
        } else if(!emailRegex.test(email)){
            throw new CustomError("Invalid email");
        }

        email = (email as String).toLowerCase();

        const user:User|null = await UserModel.findOne({email});

        if(user){
            throw new CustomError("Email is already registerd");
        }

        const newUser:User = new UserModel({
            userId: v4(),
            name,
            email,
            password
        });

        await newUser.save();
        const resp:SuccessResponse<string> = response.success("Registration successful");
        res.send(resp);

    } catch (e){
        const resp: ErrorResponse = response.errorHandle(e);
        res.send(resp);
    }
    
}

export const login = (req:Request, res:Response) => {
    const { email, password } = req.body;

    if(!email || !password){
        throw new Error("Both email and password are required");
    } else if(!emailRegex.test(email)){
        throw new Error("Invalid email");
    }

    
}
