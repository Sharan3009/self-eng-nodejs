import { genSalt, hash, compare } from "bcrypt";

class Password {

    public hash = async (password:string):Promise<string> => {
        const salt:string = await genSalt();
        const hashPassword:string = await hash(password,salt);
        return hashPassword;
    }

    public compare = async (password:string,encryptedPassword:string):Promise<boolean> => {
        const comparePassword:boolean = await compare(password,encryptedPassword);
        return comparePassword;
    }
}

export default new Password();