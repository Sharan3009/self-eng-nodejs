import { Socket } from "socket.io";
import qr from "qrcode";
import response from "../utils/response";

export const generateQR = (socket:Socket) => {
    const channel:string = "generate-qr";
    socket.on(channel,(text:string)=>{
        qr.toDataURL(text,(err:Error,url:string)=>{
            if(err){
                socket.emit(channel,response.error(err.message));
            } else {
                socket.emit(channel,response.success(url));
            }
        })
    })
}