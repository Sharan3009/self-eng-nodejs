import { DBConfig } from "./DBConfig";

export interface AppConfig {
    readonly port: number,
    readonly allowedCorsOrigin: string,
    env?: string,
    db?: DBConfig,
    apiVersion?: string
}