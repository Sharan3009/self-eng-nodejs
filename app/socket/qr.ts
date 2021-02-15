import { Socket } from "socket.io";
import qr from "qrcode";
import response from "../utils/response";
import { Response } from "../../Interface/Response";
import { v5, v4 } from "uuid";
import { getKeyFromSocket, setKeyToSocket } from "../utils/helperFunctions";

export const generateQR = (socket:Socket) => {
    const channel:string = "GENERATE_QR";
    let resp:Response<any> = null;
    socket.on(channel,()=>{
        let qrCode:string = v5(socket.id,v4());
        openQrSocketChannel(socket,qrCode);
        qr.toDataURL(qrCode,
        {
            margin:0
        },
        (err:Error,url:string)=>{
            if(err){
                resp = response.error(err.message);
            } else {
                resp = response.success(url);
            }
            socket.emit(channel,resp);
        })
    })
}

const openQrSocketChannel = (socket:Socket,channel:string) => {
    let socketKey:string = "qr";
    socket.removeAllListeners(getKeyFromSocket(socket,socketKey))
    .on(channel,()=>{
        // emit the auth key
    })
    setKeyToSocket(socket,socketKey,channel);
}