import { Application } from "express";

export interface CustomRoute{
    init(app:Application):void
}