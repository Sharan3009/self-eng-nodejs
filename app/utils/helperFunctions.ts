import { v4 } from "uuid";
import jwt from "./jwt";
import { Socket } from "socket.io";

export const getTokens = (auth:string|undefined):any => {
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

export const setResponseTokens = async (headers:any):Promise<any> => {
    let { authtoken, clienttoken } = getTokens(headers.authorization);
    let obj:any = {};
    if(clienttoken){
        try{
            await jwt.verify(clienttoken);
        } catch(e:any){
            const tokenObj:any = jwt.decode(clienttoken);
            let id:string = v4();
            if(tokenObj && tokenObj.id){
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