import { sendToDialogFlow } from "./dialogflow";
import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js"
import { PayloadBoot, PayloadCurso, PayloadDocumento } from '../class/PayloadBoot';
import { DataSource } from "typeorm";
import { HistorialEstudiante } from "src/class/HistorialEstudiante";
import { Estudiante } from "src/estudiante/entities/estudiante.entity";

export const chatbot = async (client:Client, message:WAWebJS.Message, dataSource:DataSource) => {

    try {
        const resGlobal = await sendToDialogFlow(message.body, message.from );   

        for(const response of resGlobal.fulfillmentMessages){

            // TODO: Enviar texto de respuesta : enviar resuesta txt
            console.log(response.text)
            if(response.text){
                await client.sendMessage(message.from, response.text.text[0]);
            }

            // TODO: Enviar data en base a intents_especificos
            if(response.payload){
                const intentUbicacion = resGlobal.intent.displayName;
                setTimeout(() => {
                    switch (intentUbicacion) {
                        case 'consulta_cursos':
                            sendCursos(client, message, dataSource);
                            break;
                        case 'consulta_curso_especifico':
                            sendCursoEspecifico(client, message, resGlobal.parameters);
                            break;
                        case 'pedido_documento':
                            // console.log(JSON.stringify(response))
                            cosultaMensualidadDeuda(client, message, resGlobal.parameters, dataSource)
                            break;
                    }
                }, 1000);
            }
            
            // TODO: Verificar si existe un payload para enviar
            if(response.payload){
                setTimeout(async() => {
                    existPayload(client, message, response.payload.fields)
                }, 1000);
            }

        }
    } catch (e) {
        console.log("ERROR BOT")
    }

    
}

const prepareMedia = async (payload:PayloadBoot) => {
    return await MessageMedia.fromUrl(payload.media.stringValue);
}

const existPayload = async (client:Client, message:WAWebJS.Message, payload:PayloadBoot | any) =>{
    try {
        let msg:string;
        if((payload.message.stringValue!='') && (payload.link.stringValue!='')){
            msg = `${payload.message.stringValue} 👉 ${payload.link.stringValue}`;
        }else if(payload.message.stringValue){
            msg = `${payload.message.stringValue}`;
        }else if(payload.link.stringValue){
            msg = `${payload.message.stringValue}`;
        }
        if(msg){
            await client.sendMessage(message.from, msg);
        }
        if(payload.media.stringValue){
            const caption = payload.description_media.stringValue;
            const media = await prepareMedia(payload);
            await client.sendMessage(message.from, media,{ caption });
        }
    } catch (e) {
        console.log("Error al verificar: ", e);
        throw new Error(e);
    }
}

const sendCursos = async (client:Client, message:WAWebJS.Message, dataSource:DataSource) => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const cursos = await queryRunner.query(`
            SELECT NombreCurso, Nivel FROM curso
            INNER JOIN nivel ON nivel.Id = curso.nivelId
            WHERE curso.Estado = true
            AND curso.EstadoApertura = true
            ORDER BY curso.createdAt DESC`,
        );

        await queryRunner.commitTransaction();
    
        let lista = 'Estos son los cursos aperturados:\n';
        
        if(cursos.length==0){
            await client.sendMessage(message.from,`😬 Disculpa, Por el momento no tenemos cursos aperturados`);   
            return;
        }
        cursos.forEach(data => {
            lista += `°📙 *${data.NombreCurso.toUpperCase()}* - nivel ${data.Nivel} \n`;
        })
        lista +=`👉 Escriba su curso de preferencia...`;

        await client.sendMessage(message.from, lista);

    }catch (e) {
        console.log("Error consulta cursos CEIDBOT: ", e);
        await queryRunner.rollbackTransaction();
        throw new Error(e);
    } finally {
        await queryRunner.release();
    }
} 
const sendCursoEspecifico = async (client:Client, message:WAWebJS.Message, response:any) => {
    const payloadCurso:PayloadCurso = response.fields;
    const NombreCurso = payloadCurso.curso_especifico.stringValue;
    const NivelCurso = payloadCurso.nivel_curso.stringValue;
    console.log(NombreCurso, NivelCurso)
    // if(!NombreCurso){
    //     await client.sendMessage(message.from,`😬 Disculpa, podría especificar la información del curso solicitado por favor?`);   
    //     return;
    // }
    // // console.log("curso: ", NombreCurso,"Nivel:", (NivelCurso)?NivelCurso:'no existe')
    // const cursos = await _curso.findByName(NombreCurso,(NivelCurso)?NivelCurso:'');

    // let lista = '';

    // if(cursos.length==0){
    //     await client.sendMessage(message.from,`😬 Disculpa, por el momento no tenemos información sobre el curso ${NombreCurso} ${NivelCurso}`);   
    //     return;
    // }

    // cursos.forEach(curso => {
    //     lista += `📘 *Curso:* ${curso.NombreCurso.toUpperCase()} \n 🎯 *Nivel del curso:* ${curso.nivel.Nivel} \n #️ *Módulos:* ${curso.modulo.Modulo} módulos \n 📝 *Descripción:* \n ${curso.DescripcionCurso} \n *👉 Link de los requisitos:* ${curso.LinkRequisitos}`;
    // })
 
    // await client.sendMessage(message.from, lista);
} 

const cosultaMensualidadDeuda = async (client:Client, message:WAWebJS.Message, response:any, dataSource:DataSource) => {

    /** Obteniendo los datos */
    const payloadDoc:PayloadDocumento = response.fields;
    const Documento = payloadDoc.Documento.numberValue;
    const TipoDocumento = payloadDoc.TipoDocumento.stringValue;
    console.log(Documento, TipoDocumento)

    // SELECT estudiante.Nombres from estudiante WHERE estudiante.TipoDocumento = 'DNI' AND estudiante.Documento = '71690691';
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const resEstudiante = await queryRunner.query(`
            SELECT estudiante.Nombres from estudiante 
            WHERE estudiante.TipoDocumento = '${TipoDocumento}' AND estudiante.Documento = '${Documento}';`,
        );

        await queryRunner.commitTransaction();

        /** Si no existe el estudiante */
        if(resEstudiante.length == 0){
            await client.sendMessage(message.from, `El estudiante no se encuentra registrado en el sistema o verifque que su documento digitado sea correcto.`);
            return ;
        }
        /** cuando existe el estudiante */
        const estudiante:Estudiante = resEstudiante[0];

        const data:HistorialEstudiante[] = await historialPagosestudiante(dataSource, TipoDocumento, Documento);
        if(data.length == 0){
            await client.sendMessage(message.from, `${estudiante.Nombres} aún no cuentas con un historial de pagos.\n Se le recomienda registrar tus pagos antes de la fecha del inicio de los módulos de tu curso o cursos.`);
            return;
        }

        let msg = `${estudiante.Nombres} su historial de pago:\n`;
        data.forEach( info => {
            msg +=`Grupo ID: ${info.grupoId}\n`
            msg +=`Módulo: ${info.Modulo}\n`
            msg +=`Fecha de pago: ${info.FechaPago}\n`
            msg +=`Monto de pago: ${info.MontoPago}\n`
            msg +=`Estado pago: ${info.pago_verificado?'Su pago fue verificado':'Su pago no fue verificado'}\n`
            msg +=`Código de voucher: ${info.CodigoVoucher}\n`
            msg +=`Mora: ${info.MontoMora?info.MontoMora:'No cuenta con mora'}\n`
            msg +=`Estado mora: ${info.mora_verificada?'Mora subsanada':'Mora no subsanada'}\n`
            msg +=`-----------\n`
        })
        console.log(data)
        await client.sendMessage(message.from, msg);

    }catch (e) {
        console.log("Error consulta cursos CEIDBOT: ", e);
        await queryRunner.rollbackTransaction();
        throw new Error(e);
    } finally {
        await queryRunner.release();
    }
} 

const historialPagosestudiante = async (dataSource:DataSource, TipoDocumento:string, Documento:string) => {

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const estudiante = await queryRunner.query(`
        SELECT grupo.Id as grupoId, 
            estudiante.Nombres, 
            estudiante.ApellidoPaterno, 
            estudiante.ApellidoMaterno, 
            categoria_pago.TipoCategoriaPago, 
            pago.MontoPago, 
            pago.FechaPago, 
            pago.CodigoVoucher,
            pago.Verificado as pago_verificado,
            mora.MontoMora,
            mora.Verificado as mora_verificada,
            modulo.Modulo  FROM estudiante
        INNER JOIN estudiante_en_grupo on estudiante.Id = estudiante_en_grupo.estudianteId
        INNER JOIN grupo on grupo.Id = estudiante_en_grupo.grupoId
        LEFT JOIN mora on mora.estudianteEnGrupoId = estudiante_en_grupo.Id
        LEFT JOIN pago on estudiante_en_grupo.Id = pago.estudianteEnGrupoId
        LEFT JOIN categoria_pago on categoria_pago.Id = pago.categoriaPagoId
        LEFT JOIN medio_de_pago on medio_de_pago.Id = pago.medioDePagoId
        LEFT JOIN grupo_modulo on pago.grupoModuloId = grupo_modulo.Id
        LEFT JOIN modulo on grupo_modulo.moduloId = modulo.Id
        WHERE (pago.Estado=true OR pago.Estado is null) and 
            (categoria_pago.Id= 1 OR categoria_pago.Id = 4 OR categoria_pago.Id is null) and 
            grupo.Estado = 1 and
            (SELECT estado_grupo.Id from estado_grupo WHERE estado_grupo.Id = grupo.estadoGrupoId ) !=3 AND
            estudiante.Documento = '${Documento}' AND estudiante.TipoDocumento = '${TipoDocumento}'; 
        `);

        await queryRunner.commitTransaction();
        return estudiante;
    }catch (e) {
        console.log("Error consulta estudiantes pagos: ", e);
        await queryRunner.rollbackTransaction();
        throw new Error(e);
    } finally {
        await queryRunner.release();
    }
}




