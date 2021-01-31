'use strict'
import { Schema, model } from 'mongoose';
import { User } from '../../Interface/mongoose/User';
import { SocialProviders } from '../../Enums/Social';

let users: Schema = new Schema({
    
    userId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    name: {
        type: String,
        required: true
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
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    
})

export default model<User>('User', users);