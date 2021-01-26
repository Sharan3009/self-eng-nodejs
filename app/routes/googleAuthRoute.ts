import { Application } from "express";
import { CustomRoute } from "../../Interface/CustomRoute";
import { authorizeSuccess, authorizeFailed,authorizeCallback } from "../controllers/googleAuthController";
import passport from "passport";
import appConfig from "../../config/appConfig";
import { HttpMethods } from "../../Class/HttpMethods";

class GoogleAuthRoute extends HttpMethods implements CustomRoute{

    private static apiVersion:string = appConfig.get("apiVersion");
    private static subRoute:string = "google";

    constructor(){
        super(GoogleAuthRoute.apiVersion,GoogleAuthRoute.subRoute);
    }

    public init = (app:Application):void =>{

       this.get(app,"auth",passport.authenticate("google",{ scope: ["profile","email"]}));

       this.get(app,"success",authorizeSuccess);

       this.get(app,"failed",authorizeFailed);

       this.get(app,"callback",passport.authenticate("google",{failureRedirect:GoogleAuthRoute.apiVersion+"google/failed"}),authorizeCallback);
       
    }
}

module.exports = new GoogleAuthRoute();