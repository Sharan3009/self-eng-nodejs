import { v4 } from "uuid";
import jwt from "./jwt";
import { Socket } from "socket.io";
import { Tokens } from "../../Interface/Response";

export const getTokens = (auth:string|undefined):Tokens => {
    const obj:any = {};
    if(!auth){
        return obj;
    }
    auth.split(", ").forEach((token:string)=>{
        const [key,value] = token.split(" ");
        obj[key] = value;
    })
    return obj;
}

export const setResponseTokens = async (headers:any):Promise<Tokens> => {
    let { authtoken, clienttoken } = getTokens(headers.authorization);
    const obj:Tokens = {};
    if(clienttoken){
        try{
            await jwt.verify(clienttoken);
        } catch(e:any){
            const tokenObj:any = jwt.decode(clienttoken);
            let id:string = v4();
            if(tokenObj){
                id = tokenObj.id;
            }
            clienttoken = await jwt.sign({
                id
            })
            obj.clienttoken = clienttoken;
        }
    } else {
        clienttoken = await jwt.sign({
            id:v4()
        })
        obj.clienttoken = clienttoken;
    }
    if(authtoken){
        try{
            await jwt.verify(authtoken);
        } catch(e:any){
            const tokenObj:any = jwt.decode(authtoken);
            if(tokenObj){
                const {id, name, email} = tokenObj;
                authtoken = await jwt.sign({
                    id,name,email
                })
            }
            obj.authtoken = authtoken;
        }
    }
    return obj;
}

export const setKeyToSocket = (socket:Socket,key:string,value:any):void => {
    (socket as any)[key] = value;
}

export const getKeyFromSocket = (socket:Socket,key:string):any => {
    return (socket as any)[key];
}