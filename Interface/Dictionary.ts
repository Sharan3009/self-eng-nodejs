export interface DictionaryConfig {
    userAgent:string,
    hostname:string,
    lang:string,
    path:string,
    port: number
}

export interface DictAudio {
    audios: AudioLang
}

export interface AudioLang {
    en: Array<string>
}

export interface DictTitle {
    title: string
}

export interface DictResponse extends DictTitle,DictAudio {
   
}