'use strict'
import { Schema, model } from 'mongoose';
import { User } from '../../Interface/mongoose/User';

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
        required: true
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