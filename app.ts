import express from 'express';
import config from './config/appConfig';
import AppStartUtil from './app/utils/appStartUtil';

const app:express.Application = express();

const port:number = config.port;

const startup = new AppStartUtil(app);

// without bodyParser posting method cannot happen and had to be anywhere before routes function
startup.setDotEnv()
.setHttpLogger()
.useBodyParser()
.useCookieParser()
.useHelmet()
.includeModels()
.includeRoutes();

app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello world");
})

app.listen(port,()=>{
    console.log(`Server is started at port:${port}`);
})