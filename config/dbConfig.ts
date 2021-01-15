import { DBConfig } from "../Interface/DBConfig";
import convict from "convict";

const config:convict.Config<DBConfig> = convict({
    host:{
        format: function(val){
            if (!val) throw new Error("DB_HOST cannot be empty");
        },
        env: "DB_HOST",
        default: ""
    },
    name:{
        format: function(val){
            if (!val) throw new Error("DB_NAME cannot be empty");
        },
        env: "DB_NAME",
        default:""
    }
})

config.validate();

export default config;