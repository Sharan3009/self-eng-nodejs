import {WebSiteConfig, DictionaryConfig} from "../Interface/Dictionary";

export const websiteConfig:WebSiteConfig = {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
    port: 443
}

export const definitionConfig:DictionaryConfig = {
    hostname: "www.lexico.com",
    path: "/definition/",
}

export const translationConfig: DictionaryConfig = {
    hostname: "www.translatedict.com",
    path: ""
}