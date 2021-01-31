import { Document } from "mongoose";
import { SocialProviders } from "../../Enums/Social";

export interface User extends Document {
    userId:string,
    name:string,
    email:string,
    password:string,
    socialLogin: Array<{id:string,provider:SocialProviders}>,
    verified:boolean,
    createdOn:Date
}

export interface UserValidConfig {
    maxNameLength: number,
    minPasswordLength:number
}