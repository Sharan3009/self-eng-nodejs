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