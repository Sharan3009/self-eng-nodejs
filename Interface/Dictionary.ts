import { ErrorResponse, SuccessResponse } from "./Response";

export interface DictionaryConfig {
    userAgent:string,
    hostname:string,
    lang:string,
    path:string,
    port: number
}

export interface DictPhonetics {
    phonetics: Array<DictPhonetic>
}

export interface DictPhonetic {
    text: string,
    audio: string
}

export interface DictTitle {
    title: string
}

export interface DictData extends DictTitle,DictPhonetics {
   
}

export type DictResponse = SuccessResponse<DictData> | ErrorResponse;