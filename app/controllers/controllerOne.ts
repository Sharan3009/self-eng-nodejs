import { Request, Response } from "express";
import mongoose,{ Model } from "mongoose";
import { DictResponse } from "../../Interface/Dictionary";
import dictionary from "../modules/dictionary";

// change any to usefull iterface and remove the comment.
const ModelOne:Model<any> = mongoose.model("ModelOne");

export let funcOne = async (req:Request,res:Response):Promise<void> => {
    const word:string = <string>req.query.word;
    const resp:DictResponse= await dictionary.define(word)
    res.send(resp);
}