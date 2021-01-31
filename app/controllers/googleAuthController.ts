import { Request, Response } from "express";
import mongoose,{ Model } from "mongoose";
import passport, { Profile } from "passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import authConfig from "../../config/authConfig";
import appConfig from "../../config/appConfig";

// change any to usefull iterface and remove the comment.
const User:Model<any> = mongoose.model("User");
let apiVersion:string = appConfig.get("apiVersion");

export let authorizeSuccess = (req:Request,res:Response):void => {
    const user:Profile = <Profile>req.user;
    if(user && user.id){
        res.send(`<title>custom_msg - success - ${req.cookies.authToken}</title>`)
    } else {
        res.redirect(apiVersion+"google/failed");
    }
}

export let authorizeFailed = (req:Request,res:Response):void => {
    const user:Profile = <Profile>req.user;
    if(user && user.id){
        res.redirect(apiVersion+"google/success");
    } else {
        res.send(`<title>custom_msg - failed</title>`);
    }
}

export let authorizeCallback = (req:Request,res:Response):void=>{
    res.redirect(apiVersion+"google/success");
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