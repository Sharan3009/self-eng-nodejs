import CustomError from "../../Class/CustomError";
import { ErrorResponse, SuccessResponse } from "../../Interface/Response";
import logger from "./logger";

class Response {

    public success = <T>(rnd:string,data:T):SuccessResponse<T> => {

        const resp:SuccessResponse<T> = {
            status: "success",
            rnd,
            data
        }

        return resp;
    }

    public error = (rnd:string,message:string):ErrorResponse => {
        
        const resp: ErrorResponse = {
            status: "error",
            rnd,
            message
        }

        return resp;
    }

    public errorHandle = (err:Error):string => {
        logger.error(err.message);
        let msg = "Something went wrong";
        if(err instanceof CustomError){
            msg = err.message;
        }
        return msg;
    }
}

export default new Response();