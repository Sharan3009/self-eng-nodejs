import { Server as Http } from "http";
import { Server } from "socket.io";
import e from "./connectionEvents";

class AppSocket {

    private static io:Server;

    public connect = (server:Http):void =>{

        if(!AppSocket.io){
            AppSocket.io = new Server(server);
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