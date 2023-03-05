
export class ResLogin {
    msg:string;
    ok:boolean;
    token:string;
    user:LoginUser;

    constructor(msg:string, ok:boolean, token:string, user:LoginUser){
        this.msg = msg;
        this.ok = ok;
        this.token = token;
        this.user = user;
    }
}

export class LoginUser{
    Id:number;
    DNI?:string;
    Email?:string;
    Nombres:string;
    ApellidoPaterno:string;
    ApellidoMaterno?:string;
    TipoRol?:string;
}