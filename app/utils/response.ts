import CustomError from "../../Class/CustomError";
import { ErrorResponse, SuccessResponse } from "../../Interface/Response";
import logger from "./logger";

class Response {

    public success = <T>(data:T):SuccessResponse<T> => {

        const resp:SuccessResponse<T> = {
            status: "success",
            data
        }

        return resp;
    }

    public error = (message:string):ErrorResponse => {
        
        const resp: ErrorResponse = {
            status: "error",
            message
        }

        return resp;
    }

    public errorHandle = (err:Error):ErrorResponse => {
        logger.error(err.message);
        let msg = "Something went wrong";
        if(err instanceof CustomError){
            msg = err.message;
        }
        return this.error(msg);
    }
}

export default new Response();