import { Application, RequestHandler } from "express";

export class HttpMethods {

    protected baseUrl: string;
    
    constructor(apiVersion:string, subRoute:string){
        this.baseUrl = apiVersion + subRoute;
    }

    protected get = (app:Application, endpoint:string,...callback:Array<RequestHandler>):void => {
        app.get(`${this.baseUrl}/${endpoint}`,callback);
    }

    protected post = (app:Application, endpoint:string,...callback:Array<RequestHandler>):void => {
        app.post(`${this.baseUrl}/${endpoint}`,callback);
    }

    protected put = (app:Application, endpoint:string,...callback:Array<RequestHandler>):void => {
        app.put(`${this.baseUrl}/${endpoint}`,callback);
    }

    protected delete = (app:Application, endpoint:string,...callback:Array<RequestHandler>):void => {
        app.delete(`${this.baseUrl}/${endpoint}`,callback);
    }
}