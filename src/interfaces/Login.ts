
export class Login{
    Id:number;
    Nombres:string;
    ApellidoPaterno:string;
    ApellidoMaterno?:string;
    Email?:string;
    TipoRol?:string;
    DNI?:string;
    Celular?:string;
    Direccion?:string;
    
    constructor(Id:number,
                Nombres:string, 
                ApellidoPaterno:string, 
                ApellidoMaterno?:string,
                Email?:string,
                TipoRol?:string,
                DNI?:string,
                Celular?:string,
                Direccion?:string){
        this.Id = Id;
        this.Nombres = Nombres;
        this.ApellidoPaterno = ApellidoPaterno;
        this.ApellidoMaterno = ApellidoMaterno;
        this.Email = Email;
        this.TipoRol = TipoRol;
        this.DNI = DNI;
        this.Celular = Celular;
        this.Direccion = Direccion;
    }
}