import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Provincia {
    @PrimaryGeneratedColumn({type:'int'})
    IdProvincia:number;        
	
    @Column({type:'varchar', length:30})
    NombreProvincia:string;      
	
    @Column({type:'varchar', length:45})
    EtiquetaUbigeo:string;       
	
    @Column({type:'int'})
    CodigoUbigeo:number;
	
    @Column({type:'varchar', length:44})
    BuscadorUbigeo:string;      
	
    @Column({type:'int'})
    NumeroHijosUbigeo:number;
	
    @Column({type:'int'})
    NivelUbigeo:number;
	
    @Column({type:'int'})
    IdPadreUbigeo:number;
}
