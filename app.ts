import express from 'express';
require('dotenv').config(); // this should be placed before everything because it is responsible for environment variables
import appConfig from './config/appConfig';
import AppStartUtil from './app/utils/appStartUtil';

const app:express.Application = express();

const startup:AppStartUtil = new AppStartUtil(app);

// without bodyParser posting method cannot happen and had to be anywhere before routes function
startup.setHttpLogger()
.useBodyParser()
.useCookieParser()
.useHelmet()
.includeModels()
.includeRoutes()
.connectDB();

const port:number = appConfig.get("port");

app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello world");
})

app.listen(port,()=>{
    console.log(`Server is started at port:${port}`);
})