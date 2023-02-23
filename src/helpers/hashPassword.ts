import * as bcrypt from 'bcrypt';

export const hashPassword = (password:string) =>{
    const salt = bcrypt.genSaltSync(10);
    const newPassword = bcrypt.hashSync(password, salt);
    return newPassword;
}    
 
export const comparePassword = (password:string, hash:string):boolean => {
    return bcrypt.compareSync(password, hash); 
}