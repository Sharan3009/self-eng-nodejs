import {Application} from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import fs from 'fs';
import db from "./mongoose";
import logger from "../utils/logger";
import morgan from "morgan";

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

    public includeModels = ():AppStartUtil => {
        // getting all models present in models folder
        if(fs.existsSync(this.modelsPath)){
            fs.readdirSync(this.modelsPath).forEach((file)=>{
                if(~file.indexOf('js')){
                    require(`${this.modelsPath}/${file}`)
                }
            })
        }
        return this;
    }

    public includeRoutes = ():AppStartUtil => {
        // getting all routes present in routes folder
        if(fs.existsSync(this.routesPath)){
            fs.readdirSync(this.routesPath).forEach((file)=>{
                if(~file.indexOf('.js')){
                    let route = require(`${this.routesPath}/${file}`)
                    route.setRouter(this.app)
                }
            })
        }
        return this;
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
}