import { CorsOptions } from "cors";
import { Server as Http } from "http";
import { Server } from "socket.io";
import config from "../../config/appConfig";
import e from "./connectionEvents";

class AppSocket {

    private static io:Server;

    public connect = (server:Http):void =>{

        if(!AppSocket.io){
            AppSocket.io = new Server(server,{
                cors: <CorsOptions>config.get("ALLOWED_CORS_ORIGIN")
            });
            this.attachEvents();
        }
    }

    private attachEvents = ():void => {
        this.onConnection();
    }

    private onConnection = ():void => {
        e.onConnection(AppSocket.io);
    }
}

export default new AppSocket().connect;