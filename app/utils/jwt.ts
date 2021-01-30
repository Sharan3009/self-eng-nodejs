import { verify, sign, Secret } from "jsonwebtoken";
import config from "../../config/authConfig";
import { promisify } from "util";

class JWT {

    private secret:string = config.get("jwtSecret");

    public sign = async (payload:any):Promise<void> => {
        
        const signAsync = promisify<any,Secret>(sign);
        return await signAsync(payload,this.secret);
    }

    public verify = async (token:string):Promise<void> => {
        const verifyAsync = promisify<any,Secret>(verify);
        return await verifyAsync(token,this.secret);
    }
}

export default new JWT();