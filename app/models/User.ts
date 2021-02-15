'use strict'
import { Schema, model } from 'mongoose';
import { User } from '../../Interface/mongoose/User';
import { SocialProviders } from '../../Enums/Social';
import config from "../../config/appConfig";
import { Environment } from '../../Enums/Environment';
import userConfig from "../../config/userConfig";
import { genSalt, hash, compare } from "bcrypt";

let users: Schema = new Schema({
    
    id: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        maxlength: userConfig.maxNameLength
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index:true,
        lowercase:true
    },
    password: {
        type: String,
        required: [
            function(this:User){ return !this.socialLogin.length },
            `Password is required if socialLogin is not provided`
        ]
    },
    socialLogin:{
        type: [{
            id:String,
            provider: {
                type: String,
                enum: SocialProviders
            }
        }],
        default: []
    },
    verified: {
        type: Boolean,
        default: (config.get("NODE_ENV")===Environment.dev)?true:false
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    
})

users.methods = {
    comparePassword : async (password:string,encryptedPassword:string):Promise<boolean> => {
        const comparePassword:boolean = await compare(password,encryptedPassword);
        return comparePassword;
    }
}


users.pre<User>("save", async function(next){
    try{
        const salt:string = await genSalt();
        const hashPassword:string = await hash(this.password,salt);
        this.password = hashPassword;
        next();
    } catch(e:any){
        next(e.message);
    }
})

export default model<User>('User', users);