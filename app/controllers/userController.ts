import { Request, Response } from "express";
import CustomError from "../../Class/CustomError";
import { User } from "../../Interface/mongoose/User";
import UserModel from "../models/User";
import { v4 } from "uuid";
import response from "../utils/response";
import validation from "../utils/validation";
import jwt from "../utils/jwt";
import userConfig from "../../config/userConfig";
import { ExposedHeaders } from "../../Enums/Cors";

export const signup = async (req:Request,res:Response):Promise<any> =>{

    try{
        let { name, email, password, confirmPassword } = req.body;
        validateSignupParams(name,email,password,confirmPassword);
        await ifEmailNotRegistered(email);
        await registerUser(name,email,password);
        res.send("Registration successful");

    } catch (e){
        res.status(400).send(response.errorHandle(e));
    }
    
}

const validateSignupParams = (name:string, email:string, password:string, confirmPassword:string):void => {
   const { maxNameLength, minPasswordLength } = userConfig;
   let error:string = "";
    if(!name || !email || !password || !confirmPassword){
        error = "Some required fiels are not provided";
    } else if(!validation.username(name)){
        error = `Name cannot be more than ${maxNameLength} characters`;
    } else if(!validation.email(email)){
        error = "Invalid email";
    } else if(!validation.password(password)){
        error = `Password must be atleast ${minPasswordLength} characters long`;
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
        id: v4(),
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
        const token:string = await jwt.sign({
            id,name,email
        });
        res.setHeader(ExposedHeaders.auth,token);
        res.send();
    } catch (e){
        res.status(400).send(response.errorHandle(e));
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
    } else if(!user.verified){
        throw new CustomError("Email is not verified");
    } else if(user.password && !await user.comparePassword(password,user.password)){
        throw new CustomError("Incorrect password");
    } else if(user.socialLogin.length){
        throw new CustomError("Email is registered with social login");
    }
    return user;
}

