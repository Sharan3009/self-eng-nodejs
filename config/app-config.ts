
import { AppConfig } from "../Interface/appConfig";

let appConfig:AppConfig = {
    port:3000,
    allowedCorsOrigin:"*"
};

appConfig.env = "dev";
appConfig.db = {
    uri:"mongodb://127.0.0.1:27017/selfEngDB"
};
appConfig.apiVersion = "/api/v1";

export default appConfig;