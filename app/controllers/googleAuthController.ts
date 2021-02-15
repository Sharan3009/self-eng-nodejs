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
import jwt from "../utils/jwt";

// change any to usefull iterface and remove the comment.
const User:Model<any> = mongoose.model("User");
const apiVersion:string = appConfig.get("apiVersion");

export const authorizeSuccess = async (req:Request,res:Response):Promise<any> => {
    const user:Profile = <Profile>req.user;
    try{
        if(user.id){
            const token:string = await saveUserAndGetToken(user);
            res.send(`<title>custom_msg - success - ${token}</title>`);
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

const saveUserAndGetToken = async (profile:Profile): Promise<string> => {
    const emailObj:any = (profile.emails as any)[0];
    const email:string = emailObj.value;
    const verified:boolean = emailObj.verified;
    const id:string = profile.id;
    const provider:SocialProviders = profile.provider as SocialProviders;
    const name:string = profile.displayName;
    
    const user:User|null = await updateProvider(email,id,provider);

    if(!user){
        await saveNewUser(name,email,verified,id,provider)
    }
    return await jwt.sign({id,email,name})
}

const updateProvider = async (email:string,id:string,provider:SocialProviders):Promise<any> => {
    const user:User|null = await UserModel.findOne({email}).lean();
    if(user){
        const providerExist:boolean = user.socialLogin.some((login:any)=>{
            return login.id===id && login.provider===provider;
        });
        if(providerExist){
            return user;
        } else {
            await UserModel.updateOne({email},{
                $push: {
                    socialLogin:{
                        id,provider
                    }
                }
            })
        }
    }
    return user;
}

const saveNewUser = async (name:string,email:string,verified:boolean,id:string,provider:SocialProviders):Promise<any> => {
    const user:User = new UserModel({
        id: v4(),
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