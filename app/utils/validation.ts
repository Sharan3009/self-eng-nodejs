class Validation {

    public email = (email:string):boolean => {

        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
        
    }

    public transformEmail = (email:string):string => {

        if(email){
            return email.toLowerCase();
        }

        return email;
    }
}

export default new Validation();