import { Server, Socket } from "socket.io";
import { generateQR } from "./qr";

class ConnectionEvents {
    public onConnection = (io:Server):void => {
        io.on("connection",function(socket:Socket){
            const {clientToken} = socket.request.headers;
            // this callback executes when client connects succesfully
            if(clientToken){
                socket.emit("authorization",{clientToken});
            }
            generateQR(socket);
        })
    }
}

export default new ConnectionEvents();