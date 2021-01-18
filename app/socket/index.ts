import { Server as Http } from "http";
import { Server } from "socket.io";

export class AppSocket {

    public static io:Server;
    
    constructor(server:Http){
        this.connect(server);
    }

    private connect = (server:Http):void =>{
        if(!AppSocket.io){
            AppSocket.io = new Server(server);
        }
    }
}

export default AppSocket.io;