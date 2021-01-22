import { ErrorResponse, SuccessResponse } from "./Response";

export interface WebSiteConfig {
    userAgent:string,
    port: number
}

export interface DictionaryConfig {
    hostname:string,
    path:string,
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

export interface DictMeanings {
    meanings: Array<DictDefinition>
}

export interface DictDefinition {
    partOfSpeech: string,
    definitions: Array<DictMeaning>
}

export interface DictMeaning {
    meaning: string,
    usage?: string,
    synonyms?: Array<string>,
    antonyms?: Array<string>
}

export interface DictData extends DictTitle,DictPhonetics,DictMeanings {
   
}

export type DictResponse = SuccessResponse<DictData> | ErrorResponse;