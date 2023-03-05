import { Injectable } from '@nestjs/common';
import { jsPDF } from "jspdf";
import { join } from 'path';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class ReportsService {

    constructor(private _userService:UsuarioService){}

    async generateReportUser(pagination:PaginationQueryDto){
        
        const doc = new jsPDF('p');
        doc.text('Lista de usuarios activos',20,20);
        const listUsers = await this._userService.findAll(pagination);

        const headersUsers = ['idUser','name','lastName','email','isActive'];

        const data:any[] = [];

        listUsers.data.forEach( res => {
            const user = { idUser:String(res.Id),
                           name: res.Nombres, 
                           lastName:res.ApellidoPaterno, 
                           email:res.Email,
                           isActive: 'yes'
                        }
            data.push(user)
        });

        doc.table(20, 25, data, headersUsers,null);

        const baseURL  = '../public/';
        // const baseFile = `reports-user/${uuidv4()}.pdf`;
        const baseFile = `reports-user/mi-reporte.pdf`;

        const filePath = join(__dirname,`${baseURL}${baseFile}`);
        await doc.save(filePath);
        
        return {
            msg:'Rporte generado',
            url:`http://localhost:3000/${baseFile}`
        };
    }
}
