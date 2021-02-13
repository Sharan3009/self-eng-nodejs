import { v4 } from "uuid";
import jwt from "./jwt";

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
    return obj;
}