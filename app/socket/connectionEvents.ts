import { Server, Socket } from "socket.io";
import { Tokens } from "../../Interface/Response";
import { getMeaning } from "./dictionary";
import { generateQR } from "./qr";

class ConnectionEvents {
    public onConnection = (io:Server):void => {
        io.on("connection",function(socket:Socket){
            const {clienttoken, authtoken} = socket.request.headers;
            // this callback executes when client connects succesfully
            const tokens:Tokens = {};
            if(authtoken){
                tokens.authtoken = authtoken as string;
            }
            if(clienttoken){
                tokens.clienttoken = clienttoken as string;
            }
            if(Object.keys(tokens).length){
                socket.emit("authorization",tokens);
            }
            generateQR(socket);
            getMeaning(socket);
        })
    }
}

export default new ConnectionEvents();