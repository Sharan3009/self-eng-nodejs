import { Socket } from "socket.io";
import qr from "qrcode";
import response from "../utils/response";
import { Response } from "../../Interface/Response";
import { v5, v4 } from "uuid";

export const generateQR = (socket:Socket) => {
    const channel:string = "GENERATE_QR";
    let resp:Response<any> = null;
    socket.on(channel,()=>{
        qr.toDataURL(v5(socket.id,v4()),
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