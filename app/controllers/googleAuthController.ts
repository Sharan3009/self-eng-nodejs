import { Request, Response } from "express";
import mongoose,{ Model } from "mongoose";
import passport, { Profile } from "passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import authConfig from "../../config/authConfig";
import appConfig from "../../config/appConfig";
import { User } from "../../Interface/mongoose/User"
import UserModel from "../models/User";
import { v4 } from "uuid";
import { SocialProviders } from "../../Enums/Social";

// change any to usefull iterface and remove the comment.
const User:Model<any> = mongoose.model("User");
const apiVersion:string = appConfig.get("apiVersion");

export const authorizeSuccess = async (req:Request,res:Response):Promise<any> => {
    const user:Profile = <Profile>req.user;
    try{
        if(user.id){
            await saveUser(user);
            res.send(`<title>custom_msg - success - ${req.cookies.authtoken}</title>`);
        }
    } catch (e){
        res.redirect(apiVersion+"google/error");
    }
}

export const authorizeError = (req:Request,res:Response):void => {
    res.send(`<title>custom_msg - error</title>`);
}

export const authorizeCallback = (req:Request,res:Response):void=>{
    res.redirect(apiVersion+"google/success");
}

const saveUser = async (profile:Profile): Promise<any> => {
    const emailObj:any = (profile.emails as any)[0];
    const email:string = emailObj.value;
    const verified:boolean = emailObj.verified;
    const id:string = profile.id;
    const provider:SocialProviders = profile.provider as SocialProviders;
    
    const user:User|null = await updateProvider(email,id,provider);

    if(!user){
        await saveNewUser(profile.displayName,email,verified,id,provider)
    }
}

const updateProvider = async (email:string,id:string,provider:SocialProviders):Promise<any> => {
    return await UserModel.findOneAndUpdate(
        {
            email,
            'socialLogin.id': {$ne: provider}
        },
        {$push: {socialLogin:{id,provider}}},
        {
            useFindAndModify:false
        }
    );
}

const saveNewUser = async (name:string,email:string,verified:boolean,id:string,provider:SocialProviders):Promise<any> => {
    const user:User = new UserModel({
        userId: v4(),
        name,
        email,
        verified,
        socialLogin:[
            {id,provider}
        ] 
    });
    await user.save();
}

const configPassport = ():void => {
    passport.use(new Strategy(
        {
            clientID: authConfig.get("clientId"),
            clientSecret: authConfig.get("clientSecret"),
            callbackURL: authConfig.get("callbackURL")
        },
        passportCallback
    ))
}

const passportCallback = (accessToken:string,refreshToken:string,profile:Profile,done:VerifyCallback):void=>{
    return done(undefined,profile);
}

const serializeUser = ():void => {
    passport.serializeUser((user:Express.User, done:(err: any, id?: any) => void):void=>{
        done(null,user);
    })
}

const deserializeUser = ():void => {
    passport.deserializeUser((user:Express.User, done:(err: any, id?: any) => void):void=>{
        done(null,user);
    })
}

configPassport();
serializeUser();
deserializeUser();