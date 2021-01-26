import dotenv from "dotenv";
dotenv.config(); // this should be placed before everything because it is responsible for environment variables

import express from 'express';
import { Server } from "http";
import appConfig from './config/appConfig';
import AppStartUtil from './app/utils/appStartUtil';
import logger from "./app/utils/logger";
import socket from "./app/socket";
import translator from "./app/modules/translator";

const app:express.Application = express();

const startup:AppStartUtil = new AppStartUtil(app);

// without bodyParser posting method cannot happen and had to be anywhere before routes function
startup.useMorgan()
.useBodyParser()
.useCookieParser()
.useHelmet()
.connectDB()
.useExpressSession()
.usePassport()
.includeModels()
.includeRoutes();

const port:number = appConfig.get("PORT");

(async () =>{

    logger.info("Starting the puppeteer");
    await translator.initiate();
    logger.info("Puppeteer is started");
    const server:Server = app.listen(port,()=>{
        logger.info(`Server is started at port:${port}`);
    })
    
    //connect socket
    socket(server);
})();
