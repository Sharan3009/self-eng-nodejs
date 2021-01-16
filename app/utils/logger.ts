import { createLogger,Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import loggerConfig from '../../config/loggerConfig';
import path from 'path';

class CustonLogger {

    private fileName:string = loggerConfig.fileName;
    private folderName:string = loggerConfig.folderName;
    private size:string = loggerConfig.size; // rotate if size exceeds the mentioned size, names will be appended with 1,2,3 etc.
    private datePattern:string = loggerConfig.datePattern; // rotate after date intervals, if files are getting filled by logs only then
    private transport:any;
    public logger:Logger=createLogger();

    constructor(){
        this.initiateLogger();
    }

    private initiateLogger = ():void =>{
        this.transport = new DailyRotateFile({
            filename: path.join(`./${this.folderName}/%DATE%/`,`${this.fileName}`),
            datePattern: this.datePattern,
            maxSize: this.size,
        })
        this.setLogger();
    }

    private setLogger = ():void =>{
        this.logger.add(this.transport);
    }
}

export default new CustonLogger().logger;