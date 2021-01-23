
import { Cors } from "../Enums/Cors";
import { Environment } from "../Enums/Environment";
import { AppConfig } from "../Interface/AppConfig";
import convict from "convict";

const config:convict.Config<AppConfig> = convict({
    NODE_ENV:{
        format: Object.values(Environment),
        env: "NODE_ENV",
        default: ""
    },
    ALLOWED_CORS_ORIGIN:{
        format: Object.values(Cors),
        env: "ALLOWED_CORS_ORIGIN",
        default: ""
    },
    PORT:{
        format: "port",
        env: "PORT",
        default: -1
    },
    apiVersion:{
        default: "/api/v1/"
    }
})

config.validate();

export default config;