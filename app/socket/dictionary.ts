import { Socket } from "socket.io";
import { DictData } from "../../Interface/Dictionary";
import { Response, SocketData } from "../../Interface/Response";
import response from "../utils/response";
import dictionary from "../modules/dictionary";

export const getMeaning = (socket:Socket) => {
    const channel:string = "GET_MEANING";
    let resp:Response<any>;
    socket.on(channel,async ({rnd,payload}:SocketData)=>{
        try {
            const data:DictData = await dictionary.getMeaning(payload);
            resp = response.success(rnd,data);
        } catch(e:any){
            const err:Error = e as Error;
            resp = response.error(rnd,err.message);
        }
        socket.emit(channel,resp);
    })
}