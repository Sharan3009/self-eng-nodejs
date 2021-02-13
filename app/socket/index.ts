import { CorsOptions } from "cors";
import { Server as Http } from "http";
import { Server, Socket } from "socket.io";
import { v4 } from "uuid";
import config from "../../config/appConfig";
import { getTokens } from "../utils/helperFunctions";
import jwt from "../utils/jwt";
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
            let { authToken, clientToken } = getTokens(socket.request.headers.authorization);
            if(clientToken){
                jwt.verify(clientToken)
                .then(next)
                .catch(async ()=>{
                    const tokenObj:any = jwt.decode(clientToken);
                    let id:string = v4();
                    if(tokenObj && tokenObj.id){
                        id = tokenObj.id;
                    }
                    clientToken = await jwt.sign({
                        id
                    })
                    socket.request.headers.clientToken = clientToken;
                    next();
                });
            } else {
                clientToken = await jwt.sign({
                    id:v4()
                })
                socket.request.headers.clientToken = clientToken;
                next();
            }
        })
    }
}

export default new AppSocket().connect;