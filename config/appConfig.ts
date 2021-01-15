
import { Cors } from "../Enums/Cors";
import { Environment } from "../Enums/Environment";
import { AppConfig } from "../Interface/AppConfig";

let appConfig:AppConfig = {
    port:3000,
    allowedCorsOrigin:Cors.all
};

appConfig.env = Environment.dev;
appConfig.db = {
    uri:"mongodb://127.0.0.1:27017/selfEngDB"
};
appConfig.apiv1 = "/api/v1";

export default appConfig;