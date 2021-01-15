import { DBConfig } from "../Interface/DBConfig";
import convict from "convict";

const config:convict.Config<DBConfig> = convict({
    host:{
        format: function(val){
            if (!val) throw new Error("DB HOST cannot be empty");
        },
        env: "DB_HOST",
        default: ""
    },
    name:{
        format: function(val){
            if (!val) throw new Error("DB NAME cannot be empty");
        },
        env: "DB_NAME",
        default:""
    }
})

config.validate();

export default config;