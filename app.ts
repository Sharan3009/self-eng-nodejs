import express from 'express';
import config from './config/app-config';
import morgan from 'morgan';
import rfs = require('rotating-file-stream');
import path from 'path';

const app:express.Application = express();

const port:number = config.port;

const pad = (num:number):string => (num > 9 ? "" : "0") + num;

var generator = (time:Date,index:number):string => {
    const fileName:string = "debug.log";
    if (!time) return fileName;
    var year = time.getFullYear();
    var month = pad(time.getMonth() + 1);
    var date = pad(time.getDate());
    var folder = `${year}-${month}-${date}`;

    return `${folder}/${folder}-${index}-${fileName}`;
};

let accessLogStream:rfs.RotatingFileStream = rfs.createStream(<rfs.Generator>generator, {
    interval: '1d', // rotate daily
    size: "10M",
    path: path.join(__dirname, 'logs'),
})

app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello world");
})

if(config.env==="dev"){
    // log all respnses to console
    app.use(morgan("dev"));
} else {
    // log all requests to debug.log
    app.use(morgan('common', {
        stream: accessLogStream
    }))
}

app.listen(port,()=>{
    console.log(`Server is started at port:${port}`);
})