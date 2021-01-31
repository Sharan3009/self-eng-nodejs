import config from "../../config/userConfig";
class Validation {

    public email = (email:string):boolean => {

        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
        
    }

    public username = (name:string): boolean => {
        if(name?.length>config.maxNameLength){
            return false;
        }
        return true;
    }

    public password = (password:string):boolean => {
        if(password?.length<config.minPasswordLength){
            return false;
        }
        return true;
    }
}

export default new Validation();