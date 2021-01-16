import { Application } from "express";
import { CustomRoute } from "../../Interface/CustomRoute";
import { funcOne } from "../controllers/controllerOne";
import appConfig from "../../config/appConfig";
import { HttpMethods } from "../../Class/HttpMethods";

class RouteOne extends HttpMethods implements CustomRoute{

    private static apiVersion:string = appConfig.get("apiVersion");
    private static subRoute:string = "routeOne";

    constructor(){
        super(RouteOne.apiVersion,RouteOne.subRoute);
    }

    public init = (app:Application):void =>{

       this.get(app,"endpointOne",funcOne);
       
    }
}

module.exports = new RouteOne();