import { Server, Socket } from "socket.io";
import { generateQR } from "./qr";

class ConnectionEvents {
    public onConnection = (io:Server):void => {
        io.on("connection",function(socket:Socket){
            // this callback executes when client connects succesfully
            generateQR(socket);
        })
    }
}

export default new ConnectionEvents();