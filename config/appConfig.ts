
import { Cors } from "../Enums/Cors";
import { Environment } from "../Enums/Environment";
import { AppConfig } from "../Interface/AppConfig";

let config:AppConfig = {
    port:3000,
    allowedCorsOrigin:Cors.all
};

config.env = Environment.dev;
config.db = {
    uri:"mongodb://127.0.0.1:27017/selfEngDB"
};
config.apiv1 = "/api/v1";

export default config;