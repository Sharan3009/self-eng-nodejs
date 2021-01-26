import { GoogleAuthConfig } from "../Interface/GoogleAuth";
import convict from "convict";
import appConfig from "./appConfig";

const config:convict.Config<GoogleAuthConfig> = convict({
    clientId:{
        format: function(val){
            if (!val) throw new Error("GOOGLE_CLIENT_ID cannot be empty");
        },
        env: "GOOGLE_CLIENT_ID",
        default: ""
    },
    clientSecret:{
        format: function(val){
            if (!val) throw new Error("GOOGLE_CLIENT_SECRET cannot be empty");
        },
        env: "GOOGLE_CLIENT_SECRET",
        default:""
    },
    callbackURL:{
        default: appConfig.get("apiVersion")+"google/callback"
    }
})

config.validate();

export default config;