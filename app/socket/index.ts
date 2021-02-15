import { CorsOptions } from "cors";
import { Server as Http } from "http";
import { Server, Socket } from "socket.io";
import config from "../../config/appConfig";
import { ExposedHeaders } from "../../Enums/Cors";
import { Tokens } from "../../Interface/Response";
import { getTokens, setKeyToSocket, setResponseTokens } from "../utils/helperFunctions";
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
            let headers:typeof socket.request.headers = socket.request.headers;
            const {clienttoken,authtoken} = getTokens(headers.authorization)
            const obj:Tokens = await setResponseTokens(headers);
            socket.request.headers = {
                ...headers,
                ...obj
            }
            setKeyToSocket(socket,ExposedHeaders.auth,authtoken || obj.authtoken);
            setKeyToSocket(socket,ExposedHeaders.client,clienttoken || obj.clienttoken);
            next();
        })
    }
}

export default new AppSocket().connect;