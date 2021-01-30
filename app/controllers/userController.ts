import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../Interface/Response";
import CustomError from "../../Class/CustomError";
import { User } from "../../Interface/mongoose/User";
import UserModel from "../models/User";
import { v4 } from "uuid";
import response from "../utils/response";
import validation from "../utils/validation";

export const signup = async (req:Request,res:Response):Promise<any> =>{

    try{

        let { name, email, password } = req.body;

        validateSignupParams(name,email,password);

        email = validation.transformEmail(email);

        await ifEmailNotRegisterd(email);

        await registerUser(name,email,password);

        const resp:SuccessResponse<string> = response.success("Registration successful");
        res.send(resp);

    } catch (e){
        const resp: ErrorResponse = response.errorHandle(e);
        res.status(400).send(resp);
    }
    
}

const validateSignupParams = (name:string, email:string, password:string):void => {
    if(!name || !email || !password){
        throw new CustomError("All fields are required");
    } else if(!validation.email(email)){
        throw new CustomError("Invalid email");
    }
}

const ifEmailNotRegisterd = async (email:string):Promise<any> =>{
    const user:User|null = await UserModel.findOne({email});
    if(user){
        throw new CustomError("Email is already registerd");
    }
}

const registerUser = async (name:string,email:string,password:string):Promise<any> => {

    const newUser:User = new UserModel({
        userId: v4(),
        name,
        email,
        password
    });

    await newUser.save();
}

export const login = async (req:Request, res:Response):Promise<any> => {

    try{
        let { email, password } = req.body;
        validateLoginParams(email,password);
        email = (email as String).toLowerCase();
        await ifValidUser(email);
        const resp:SuccessResponse<string> = response.success("Login successful");
        res.send(resp);
    } catch (e){
        const resp: ErrorResponse = response.errorHandle(e);
        res.status(400).send(resp);
    }

}

const validateLoginParams = (email:string,password:string):void => {
    if(!email || !password){
        throw new CustomError("Both Email and Password are required");
    } else if(!validation.email(email)){
        throw new CustomError("Invalid email");
    }
}

const ifValidUser = async (email:string):Promise<any> => {
    const user:User|null = await UserModel.findOne({email});
    if(!user){
        throw new CustomError("Email is not registered");
    } else if(user.verified){
        throw new CustomError("Email is not verified");
    }
}
