import { Socket } from "socket.io";
import { DictResponse } from "../../Interface/Dictionary";
import { Response } from "../../Interface/Response";
import dictionary from "../modules/dictionary";

export const getMeaning = (socket:Socket) => {
    const channel:string = "GET_MEANING";
    let resp:DictResponse;
    console.log(channel);
    socket.on(channel,async (word:string)=>{
        resp = await dictionary.define(word);
        socket.emit(channel,resp)
    })
}