import { CorsOptions } from "cors";
import { Server as Http } from "http";
import { Server, Socket } from "socket.io";
import config from "../../config/appConfig";
import { setResponseTokens } from "../utils/helperFunctions";
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
        this.middleware();
        e.onConnection(AppSocket.io);
    }

    private middleware = ():void => {
        AppSocket.io.use(async (socket:Socket,next)=>{
            let headers:any = socket.request.headers;
            const obj:any = await setResponseTokens(headers);
            socket.request.headers = {
                ...headers,
                ...obj
            }
            next();
        })
    }
}

export default new AppSocket().connect;