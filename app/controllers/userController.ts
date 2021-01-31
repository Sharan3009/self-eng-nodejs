import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../Interface/Response";
import CustomError from "../../Class/CustomError";
import { User } from "../../Interface/mongoose/User";
import UserModel from "../models/User";
import { v4 } from "uuid";
import response from "../utils/response";
import validation from "../utils/validation";
import passUtil from "../utils/passwordUtil";
import jwt from "../utils/jwt";

export const signup = async (req:Request,res:Response):Promise<any> =>{

    try{
        let { name, email, password, confirmPassword } = req.body;
        validateSignupParams(name,email,password,confirmPassword);
        password = await passUtil.hash(password);
        await ifEmailNotRegistered(email);
        await registerUser(name,email,password);
        const resp:SuccessResponse<string> = response.success("Registration successful");
        res.send(resp);

    } catch (e){
        const resp: ErrorResponse = response.errorHandle(e);
        res.status(400).send(resp);
    }
    
}

const validateSignupParams = (name:string, email:string, password:string, confirmPassword:string):void => {
   let nameLength = 20;
   let passwordLength = 8; 
   let error:string = "";
    if(!name || !email || !password || !confirmPassword){
        error = "Some required fiels are not provided";
    } else if(name.length>nameLength){
        error = `Name cannot be more than ${nameLength} characters`;
    } else if(password.length<passwordLength){
        error = `Password must be atleast ${passwordLength} characters long`;
    } else if(!validation.email(email)){
        error = "Invalid email";
    } else if(password!==confirmPassword){
        error = "Passwords do not match";
    }
    if(error?.length){
        throw new CustomError(error);
    }
}

const ifEmailNotRegistered = async (email:string):Promise<any> =>{
    const user:User|null = await UserModel.findOne({email});
    if(user){
        throw new CustomError("Email is already registered");
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
        const user:User = await ifValidUser(email,password);
        const {id,name} = user;
        const token:string = await jwt.sign({id,name,email});
        const resp:SuccessResponse<string> = response.success(token);
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

const ifValidUser = async (email:string,password:string):Promise<any> => {
    const user:User|null = await UserModel.findOne({email});
    if(!user){
        throw new CustomError("Email is not registered");
    } else if(user.verified){
        throw new CustomError("Email is not verified");
    } else if(!await passUtil.compare(password,user.password)){
        throw new CustomError("Incorrect password");
    }
    return user;
}

export const self = (req:Request, res:Response) => {
    res.send("under construction")
}
