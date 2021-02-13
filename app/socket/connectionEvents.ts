import { Server, Socket } from "socket.io";
import { generateQR } from "./qr";

class ConnectionEvents {
    public onConnection = (io:Server):void => {
        io.on("connection",function(socket:Socket){
            const {clienttoken} = socket.request.headers;
            // this callback executes when client connects succesfully
            if(clienttoken){
                socket.emit("authorization",{clienttoken});
            }
            generateQR(socket);
        })
    }
}

export default new ConnectionEvents();