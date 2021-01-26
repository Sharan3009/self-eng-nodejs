import { Request, Response } from "express";
import mongoose,{ Model } from "mongoose";
import passport, { Profile } from "passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import googleConfig from "../../config/googleAuthConfig";
import appConfig from "../../config/appConfig";

// change any to usefull iterface and remove the comment.
const ModelOne:Model<any> = mongoose.model("ModelOne");
let apiVersion:string = appConfig.get("apiVersion");

export let authorizeSuccess = (req:Request,res:Response):void => {
    res.send(req.user);
}

export let authorizeFailed = (req:Request,res:Response):void => {
    res.send("Something went wrong");
}

export let authorizeCallback = (req:Request,res:Response):void=>{
    res.redirect(apiVersion+"google/success");
}

const configPassport = ():void => {
    passport.use(new Strategy(
        {
            clientID: googleConfig.get("clientId"),
            clientSecret: googleConfig.get("clientSecret"),
            callbackURL: googleConfig.get("callbackURL")
        },
        passportCallback
    ))
}

const passportCallback = (accessToken:string,refreshToken:string,profile:Profile,done:VerifyCallback):void=>{
    return done(undefined, profile);
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