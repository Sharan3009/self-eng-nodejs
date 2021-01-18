import { Server, Socket } from "socket.io";

class ConnectionEvents {
    public onConnection = (io:Server):void => {
        io.on("connection",function(socket:Socket){
            // this callback executes when client connects succesfully
        })
    }
}

export default new ConnectionEvents();