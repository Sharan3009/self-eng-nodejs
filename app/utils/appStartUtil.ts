import { Application, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import fs from 'fs';
import db from "./mongoose";
import logger from "../utils/logger";
import morgan from "morgan";
import { CustomRoute } from '../../Interface/CustomRoute';
import path from "path";
import passport from "passport";
import session from "cookie-session";
import cors from "cors";
import { ExposedHeaders } from '../../Enums/Cors';
import { setResponseTokens } from './helperFunctions';

export default class AppStartUtil{

    private app:Application;
    private modelsPath:string = "../models";
    private routesPath:string = "../routes";

    constructor(app: Application){
        this.app = app;
    }

    public useBodyParser = ():AppStartUtil => {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        return this;
    }

    public useCookieParser = ():AppStartUtil => {
        this.app.use(cookieParser());
        return this;
    }

    public useHelmet = ():AppStartUtil => {
        this.app.use(helmet())
        return this;
    }

    public useCors = ():AppStartUtil => {
        this.app.use(cors({
            exposedHeaders: [ExposedHeaders.auth,ExposedHeaders.client]
        }));
        return this;
    }

    public includeModels = ():AppStartUtil => {
        // getting all models present in models folder
        let modelsPath:string = path.join(__dirname,this.modelsPath);
        if(fs.existsSync(modelsPath)){
            fs.readdirSync(modelsPath).forEach((file)=>{
                if(this.ifValidFile(file)){
                    require(`${modelsPath}/${file}`)
                }
            })
        }
        return this;
    }

    public includeRoutes = ():AppStartUtil => {
        // getting all routes present in routes folder
        let routesPath:string = path.join(__dirname,this.routesPath);
        if(fs.existsSync(routesPath)){
            fs.readdirSync(routesPath).forEach((file)=>{
                if(this.ifValidFile(file)){
                    let route:CustomRoute = require(`${routesPath}/${file}`);
                    route.init(this.app)
                }
            })
        }
        return this;
    }

    private ifValidFile = (file:string):boolean => {
        return /(\.ts|\.js)$/.test(file)
    }

    public useMorgan = ():AppStartUtil => {
        // start logging the requests
        this.app.use(morgan("combined",{
            stream: {
                write: function(str:string){
                    logger.error(str,{
                        source: "Morgan"
                    });
                }
            }
        }))
        return this;
    }

    public connectDB = ():AppStartUtil => {
        db.connect();
        return this;
    }

    public useExpressSession = ():AppStartUtil => {
        this.app.use(session({
            name:ExposedHeaders.auth,
            keys: ["key1","key2"]
        }))
        return this;
    }

    public usePassport = ():AppStartUtil => {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        return this;
    }

    public setResponseTokenMiddleware = ():AppStartUtil => {
        this.app.use(async (req:Request,res:Response, next:NextFunction)=>{
            const obj:any = await setResponseTokens(req.headers);
            res.set(obj);
            next();
        })
        return this;
    }
}