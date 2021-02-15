import { Document } from "mongoose";
import { SocialProviders } from "../../Enums/Social";

export interface User extends Document<any> {
    id:string,
    name:string,
    email:string,
    password:string,
    socialLogin: Array<{id:string,provider:SocialProviders}>,
    verified:boolean,
    createdOn:Date,
    comparePassword: (password:string,encryptedPassword:string)=>Promise<boolean> 
}

export interface UserValidConfig {
    maxNameLength: number,
    minPasswordLength:number
}