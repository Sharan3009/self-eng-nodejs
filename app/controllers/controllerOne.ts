import { Request, Response } from "express";
import mongoose,{ Model } from "mongoose";
import { DictResponse } from "../../Interface/Dictionary";
import dictionary from "../modules/dictionary";

// change any to usefull iterface and remove the comment.
const ModelOne:Model<any> = mongoose.model("ModelOne");

export let funcOne = (req:Request,res:Response):void => {
    const word:string = <string>req.query.word;
    dictionary.define(word).then((val:DictResponse)=>{
        res.send(val)
    }).catch((reason:DictResponse)=>{
        res.send(reason);
    })
}