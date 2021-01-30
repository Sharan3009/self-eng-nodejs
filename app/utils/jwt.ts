import { verify, sign, Secret, SignOptions } from "jsonwebtoken";
import config from "../../config/authConfig";
import { promisify } from "util";
import CustomError from "../../Class/CustomError";

class JWT {

    private secret:string = config.get("jwtSecret");

    public sign = async (payload:any):Promise<string> => {
        
        const signAsync = promisify<any,Secret,SignOptions>(sign);
        try {
            const token:void = await signAsync(payload,this.secret,{expiresIn:'0s'});
            const typeCastedToken:string = <string>(<unknown>token);
            return typeCastedToken;
        } catch (e){
            throw new CustomError("Failed to login the user");
        }
    }

    public verify = async (token:string):Promise<void> => {
        try{
            const verifyAsync = promisify<any,Secret>(verify);
            return await verifyAsync(token,this.secret);
        } catch (e){
            throw new CustomError("The session is expired");
        }
    }
}

export default new JWT();