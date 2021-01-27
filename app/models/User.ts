'use strict'
import mongoose, { Schema } from 'mongoose';

let users: Schema = new Schema({
    
    userId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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


mongoose.model('User', users);