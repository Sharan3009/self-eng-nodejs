import { Request, Response } from "express";
import mongoose,{ Model } from "mongoose";

// change any to usefull iterface and remove the comment.
const ModelOne:Model<any> = mongoose.model("ModelOne");

export let funcOne = (req:Request,res:Response):void => {
    res.send("Hello world");
}