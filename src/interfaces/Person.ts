
export class Person {

    dni?:string | undefined;
    nombres:string;
    apellidoPaterno:string;
    apellidoMaterno:string;

    constructor(dni:string, 
                nombres:string, 
                apellidoPaterno:string,
                apellidoMaterno:string){
        this.dni = dni;
        this.nombres = nombres;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
    }
    
}