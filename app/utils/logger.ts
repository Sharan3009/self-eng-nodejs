import { createLogger,Logger,format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import loggerConfig from '../../config/loggerConfig';
import appConfig from "../../config/appConfig";
import path from 'path';
import { Environment } from '../../Enums/Environment';

class CustonLogger {

    private fileName:string = loggerConfig.fileName;
    private folderName:string = loggerConfig.folderName;
    private size:string = loggerConfig.size; // rotate if size exceeds the mentioned size, names will be appended with 1,2,3 etc.
    private datePattern:string = loggerConfig.datePattern; // rotate after date intervals, if files are getting filled by logs only then
    private transport:any;
    public logger:Logger=createLogger({
        format: format.combine(
            format.splat(),
            format.timestamp({
                format:loggerConfig.timeFormat
            }),
            format.json(),
            format.metadata()
        )
    });

    constructor(){
        this.initiateLogger();
    }

    private initiateLogger = ():void =>{
        if(appConfig.get("env")===Environment.dev){
            this.devLogger();
        } else {
            this.prodLogger();
        }
        this.setLogger();
    }

    private devLogger= ():void => {
        this.transport =  new transports.Console();
    }

    private prodLogger = ():void=>{
        this.transport = new DailyRotateFile({
            filename: path.join(`./${this.folderName}/%DATE%/`,`${this.fileName}`),
            datePattern: this.datePattern,
            maxSize: this.size,
        })
    }

    private setLogger = ():void =>{
        this.logger.add(this.transport);
    }
}

export default new CustonLogger().logger;