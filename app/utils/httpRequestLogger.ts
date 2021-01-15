import * as rfs from 'rotating-file-stream';
import morgan from 'morgan';
import path from 'path';
import {Application} from 'express';
import config from '../../config/appConfig';
import { Environment } from '../../Enums/Environment';
import { MorganFormat } from '../../Enums/MorganFormat';

class HttpRequestLogger {

    private app:Application;
    private fileName:string = "debug.log";
    private folderName:string = "httpLogs";
    private interval:string = "1d"; //rotate daily
    private size:string = "10M"; // rotate if size exceed 10mb

    constructor(app:Application){
        this.app = app;
    }

    private pad = (num:number):string => (num > 9 ? "" : "0") + num;

    private generator = (time:Date,index:number):string => {
        if (!time) return this.fileName;
        var year:number = time.getFullYear();
        var month:string = this.pad(time.getMonth() + 1);
        var date:string = this.pad(time.getDate());
        var folder:string = `${year}-${month}-${date}`;

        return `${folder}/${folder}-${index}-${this.fileName}`;
    };

    private accessLogStream:rfs.RotatingFileStream = rfs.createStream(<rfs.Generator>this.generator, {
        interval: this.interval,
        size: this.size,
        path: path.join(__dirname,"../../", this.folderName)
    })

    public start = ():void =>{
        if(config.env===Environment.dev){
            // log all respnses to console
            this.app.use(morgan(MorganFormat.dev));
        } else {
            // log all requests to debug.log
            this.app.use(morgan(MorganFormat.common, {
                stream: this.accessLogStream
            }))
        }
    }
}

export default HttpRequestLogger;