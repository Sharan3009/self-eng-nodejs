import express from 'express';
import config from './config/app-config';
import HttpRequestLogger from './utils/HttpRequestLogger';

const app:express.Application = express();

const port:number = config.port;

// start logging the requests
new HttpRequestLogger(app).start();

app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello world");
})

app.listen(port,()=>{
    console.log(`Server is started at port:${port}`);
})