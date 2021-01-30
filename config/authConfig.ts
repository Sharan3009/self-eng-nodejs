import { GoogleAuthConfig, JWTConfig } from "../Interface/Auth";
import convict from "convict";
import appConfig from "./appConfig";

const config:convict.Config<GoogleAuthConfig & JWTConfig> = convict({
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
    },
    jwtSecret:{
        format: function(val){
            if (!val) throw new Error("JWT_SECRET cannot be empty and should be complex");
        },
        env: "JWT_SECRET",
        default:"this-is@my&very(long&complex)secret!key*that%ICANTHINKOF"
    },
})

config.validate();

export default config;