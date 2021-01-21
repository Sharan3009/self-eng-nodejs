import dbConfig from '../../config/dbConfig';
import mongoose, { Connection, ConnectOptions } from 'mongoose';
import { DbEvents } from '../../Enums/DbEvents';
import logger from "./logger";

class Mongoose {
    
    private host:string = dbConfig.get("host");
    private dbName:string = dbConfig.get("name");
    private db:string = "mongodb";
    private uri:string = `${this.db}://${this.host}/${this.dbName}`;
    private moncon:Connection = mongoose.connection;

    constructor(){
        this.onDbConnect();
        this.onDbDisconnect();
        this.onDbError();
        this.onNodeProcessEnd();
    }

    public connect = ():void => {
        let options:ConnectOptions = {
            useNewUrlParser:true,
            useUnifiedTopology:true
        }
        mongoose.connect(this.uri,options);
    }

    private onDbConnect = ():void => {
        let event = DbEvents.con;
        this.moncon.on(event,()=>{
            logger.info(`${this.dbName} is connected at ${this.host}`);
        })
    }

    private onDbDisconnect = ():void => {
        let event = DbEvents.discon;
        this.moncon.on(event,function(){
            // do nothing yet
        })
    }

    private onDbError = ():void => {
        let event = DbEvents.err;
        this.moncon.on(event,function(){
            process.exit(0);
        })
    }

    private onNodeProcessEnd = ():void => {
        let event = DbEvents.processEnd;
        process.on(event,()=>{
            this.moncon.close();
            // if we do no exit the process, then the port stays occupied
            process.exit(0);
        })
    }
}

export default new Mongoose();