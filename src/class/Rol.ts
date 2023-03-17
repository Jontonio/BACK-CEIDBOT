
export interface ResRol{
  msg: string;
  ok: boolean;
  count:number;
  data: Rol[];
}
export class Rol {
  Id: number;
  TipoRol?: string;
  createdAt?: string;
  updatedAt?: string;
}
