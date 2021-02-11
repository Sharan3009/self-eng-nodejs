import { Application } from "express";
import { CustomRoute } from "../../Interface/CustomRoute";
import appConfig from "../../config/appConfig";
import { HttpMethods } from "../../Class/HttpMethods";
import { signup, login, clientToken } from "../controllers/userController";

class GoogleAuthRoute extends HttpMethods implements CustomRoute{

    private static apiVersion:string = appConfig.get("apiVersion");
    private static subRoute:string = "user";

    constructor(){
        super(GoogleAuthRoute.apiVersion,GoogleAuthRoute.subRoute);
    }

    public init = (app:Application):void =>{

       this.post(app,"signup",signup);

       this.post(app,"login",login);

       this.get(app,"client",clientToken);
       
    }
}

module.exports = new GoogleAuthRoute();