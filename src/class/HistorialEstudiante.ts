class HistorialMensualidadEstudiante{
    grupoId:number;
    cursoNombre:string;
    tipoGrupoNombre:string;
    Nivel:string;
    Nombres:string;
    ApellidoPaterno:string;
    ApellidoMaterno:string;
    TipoCategoriaPago:string;
    MontoPago:number;
    FechaPago:Date;
    CodigoVoucher:string;
    pago_verificado:boolean;
    Modulo:number;
}

class HistorialMoraEstudiante{
    grupoId:number;
    cursoNombre:string;
    tipoGrupoNombre:string;
    Nivel:string;
    Nombres:string;
    ApellidoPaterno:string;
    ApellidoMaterno:string;
    MontoMora:number;
    mora_verificada:boolean;
    Modulo:number;
}

export { HistorialMensualidadEstudiante, HistorialMoraEstudiante };