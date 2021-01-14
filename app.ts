import express from 'express';
import config from './config/app-config';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const app:express.Application = express();

const port = config.port;

app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello world")
})

if(config.env==="dev"){
    // log all respnses to console
    app.use(morgan("dev"));
} else {
    // log all requests to debug.log
    app.use(morgan('common', {
        stream: fs.createWriteStream(path.join(__dirname, 'debug.log'), { flags: 'a' })
    }))
}

app.listen(port,()=>{
    console.log(`Server is started at port:${port}`);
})