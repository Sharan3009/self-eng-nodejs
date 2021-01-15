import express from 'express';
import config from './config/app-config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import HttpRequestLogger from './app/utils/HttpRequestLogger';

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

app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello world");
})

app.listen(port,()=>{
    console.log(`Server is started at port:${port}`);
})