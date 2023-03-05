import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Rol{

    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'varchar', length:40})
    TipoRol:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @OneToMany(() => Usuario, (usuario:Usuario) => usuario.rol)
    usuarios: Usuario[];

}
