import { Socket } from "socket.io";
import { DictData } from "../../Interface/Dictionary";
import { Response } from "../../Interface/Response";
import response from "../utils/response";
import dictionary from "../modules/dictionary";

export const getMeaning = (socket:Socket) => {
    const channel:string = "GET_MEANING";
    let resp:Response<any>;
    socket.on(channel,async (word:string)=>{
        try {
            const data:DictData = await dictionary.getMeaning(word);
            resp = response.success(data);
        } catch(e:any){
            const err:Error = e as Error;
            resp = response.error(err.message);
        }
        socket.emit(channel,resp);
    })
}