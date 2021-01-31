'use strict'
import { Schema, model } from 'mongoose';
import { User } from '../../Interface/mongoose/User';
import { SocialProviders } from '../../Enums/Social';
import config from "../../config/appConfig";
import { Environment } from '../../Enums/Environment';
import userConfig from "../../config/userConfig";

let users: Schema = new Schema({
    
    userId: {
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
        ],
        minlength: [
            function(this:User){ return (!this.socialLogin.length)?userConfig.minPasswordLength:null},
            `Password must be atleast ${userConfig.minPasswordLength} characters long`
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

export default model<User>('User', users);