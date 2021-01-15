import express from 'express';
import config from './config/app-config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import fs from 'fs';
import HttpRequestLogger from './app/utils/httpsRequestLogger';

const app:express.Application = express();

const port:number = config.port;

// start logging the requests
const httpLogger = new HttpRequestLogger(app);
httpLogger.start();

// without bodyParser posting method cannot happen and had to be anywhere before routes function
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(helmet());

// getting all models present in models folder
let modelsPath = './app/models';
if(fs.existsSync(modelsPath)){
    fs.readdirSync(modelsPath).forEach(function(file){
        if(~file.indexOf('js')){
            require(`${modelsPath}/${file}`)
        }
    })
}

// getting all routes present in routes folder
let routesPath = './app/routes';
if(fs.existsSync(routesPath)){
    fs.readdirSync(routesPath).forEach(function(file){
        if(~file.indexOf('.js')){
            let route = require(`${routesPath}/${file}`)
            route.setRouter(app)
        }
    })
}

app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello world");
})

app.listen(port,()=>{
    console.log(`Server is started at port:${port}`);
})