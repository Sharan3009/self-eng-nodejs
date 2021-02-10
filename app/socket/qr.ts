import { Socket } from "socket.io";
import qr from "qrcode";
import response from "../utils/response";
import { Response } from "../../Interface/Response";

export const generateQR = (socket:Socket) => {
    const channel:string = "GENERATE_QR";
    socket.on(channel,(text:string)=>{
        let resp:Response<any> = null;
        qr.toDataURL(text,(err:Error,url:string)=>{
            if(err){
                resp = response.error(err.message);
            } else {
                resp = response.success(url);
            }
            socket.emit(channel,resp);
        })
    })
}