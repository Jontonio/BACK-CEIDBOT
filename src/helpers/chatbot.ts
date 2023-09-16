import { sendToDialogFlow } from "./dialogflow";
import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js"
import { PayloadBoot, PayloadCurso, PayloadDocumento } from '../class/PayloadBoot';
import { DataSource } from "typeorm";
import { HistorialMensualidadEstudiante, HistorialMoraEstudiante } from "src/class/HistorialEstudiante";
import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import * as moment from 'moment';
moment.locale('es');

export const chatbot = async (client:Client, message:WAWebJS.Message, dataSource:DataSource) => {

    try {
        const resGlobal = await sendToDialogFlow(message.body, message.from );   

        for(const response of resGlobal.fulfillmentMessages){

            // TODO: Enviar texto de respuesta : enviar resuesta txt
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
                            sendCursoEspecifico(client, message, resGlobal.parameters, dataSource);
                            break;
                        case 'pedido_documento':
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
            msg = `${payload.message.stringValue} ${payload.link.stringValue?`👉 ${payload.link.stringValue}`:``}`;
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

const sendCursoEspecifico = async (client:Client, message:WAWebJS.Message, response:any, dataSource:DataSource) => {
    const payloadCurso:PayloadCurso = response.fields;
    const NombreCurso = payloadCurso.curso_especifico.stringValue;
    const NivelCurso = payloadCurso.nivel_curso.stringValue;

    if(!NombreCurso){
        await client.sendMessage(message.from,`😬 Disculpa, podría especificar la información del curso solicitado por favor?`);   
        return;
    }

    const cursos = await consultaCursos(dataSource, NombreCurso, NivelCurso)

    
    if(cursos.length==0){
        await client.sendMessage(message.from,`😬 Disculpa, por el momento no tenemos información sobre el curso ${NombreCurso} ${NivelCurso}`);   
        return;
    }
    let lista = '';
    
    cursos.forEach( curso => {
        lista += `📘 *Curso:* ${curso.NombreCurso.toUpperCase()} \n 🎯 *Nivel del curso:* ${curso.Nivel} \n #️ *Módulos:* ${curso.Modulo} módulos \n 📝 *Descripción:* \n ${curso.DescripcionCurso} \n ${curso.LinkRequisitos?`*👉 Link de los requisitos:* ${curso.LinkRequisitos}`:''}`;
    })
 
    await client.sendMessage(message.from, lista);
} 

const cosultaMensualidadDeuda = async (client:Client, message:WAWebJS.Message, response:any, dataSource:DataSource) => {

    /** Obteniendo los datos */
    const payloadDoc:PayloadDocumento = response.fields;
    const Documento = payloadDoc.Documento.numberValue;
    const TipoDocumento = payloadDoc.TipoDocumento.stringValue;
    // validar documentos
    const esNumero: boolean = /^[0-9]+$/.test(Documento);

    if(!esNumero){
        await client.sendMessage(message.from, '¿Podría digitar un documento válido por favor?');
        return;
    }

    // realizar la consulta
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

        const data:HistorialMensualidadEstudiante[] = await historialPagosEstudiante(dataSource, TipoDocumento, Documento);

        if(data.length == 0){
            await client.sendMessage(message.from, `¡Hola *${estudiante.Nombres}* 👋! aún no cuentas con un historial de pagos o consulte en el CEID la vigencia o estado del grupo.\nSe le recomienda registrar tus pagos antes de la fecha del inicio de los módulos de tu curso o cursos.\nCualquier duda estamos aquí para ayudarte o puede solicitar un operador humano.`);
            return;
        }

        let msg = `¡Hola *${estudiante.Nombres}* 👋! su historial de su mensualidad es:\n`;
        data.forEach( info => {
            msg +=`*Grupo ID:* ${info.grupoId}\n`
            msg +=`*Curso:* ${info.cursoNombre.toUpperCase()} ${info.Nivel.toUpperCase()}\n`
            msg +=`*Etiqueta del curso:* ${info.tipoGrupoNombre}\n`
            msg +=`*Módulo:* ${info.Modulo}\n`
            msg +=`*Fecha de pago:* ${moment(info.FechaPago).format('DD [de] MMMM [del] YYYY')}\n`
            msg +=`*Monto de pago:* S/. ${info.MontoPago}\n`
            msg +=`*Estado pago:* ${info.pago_verificado?'Su pago fue verificado':'Su pago no fue verificado'}\n`
            msg +=`*Código de voucher:* ${info.CodigoVoucher}\n`
            msg +=`------------------------------\n`
        });
        // Envio del mensajes de sus pagos
        await client.sendMessage(message.from, msg);

        // Envio para ver si tienen deuda:
        const dataMora:HistorialMoraEstudiante[] = await historialMoraEstudiante(dataSource, TipoDocumento, Documento);
        if(dataMora.length == 0){
            await client.sendMessage(message.from, `😊 Te encuentras al día con tus pagos, no cuentas con ningún pago extemporaneo (MORA).`);
            return;
        }

        let msgMora = `📢 ${estudiante.Nombres} su historial de mora:\n`;
        dataMora.forEach( info => {
            msgMora +=`*Mora del módulo ${info.Modulo}*\n`
            msgMora +=`*Mora:* ${info.MontoMora?`S/. ${info.MontoMora}`:'aun sin especificar'}\n`
            msgMora +=`*Estado mora:* ${info.mora_verificada?'Mora subsanada':((info.MontoMora && !info.mora_verificada)?'Mora no subsanada':'')}\n`
            msgMora +=`------------------------------\n`
        });
        await client.sendMessage(message.from, msgMora);

    }catch (e) {
        console.log("Error consulta cursos CEIDBOT: ", e);
        await queryRunner.rollbackTransaction();
        throw new Error(e);
    } finally {
        await queryRunner.release();
    }
} 


const historialPagosEstudiante = async (dataSource:DataSource, TipoDocumento:string, Documento:string) => {

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const estudiante = await queryRunner.query(`
        SELECT
            grupo.Id AS grupoId,
            estudiante.Nombres,
            estudiante.ApellidoPaterno,
            estudiante.ApellidoMaterno,
            categoria_pago.TipoCategoriaPago,
            pago.MontoPago,
            pago.FechaPago,
            pago.CodigoVoucher,
            pago.Verificado AS pago_verificado,
            modulo.Modulo,
            curso.NombreCurso AS cursoNombre,
            tipo_grupo.NombreGrupo AS tipoGrupoNombre,
            nivel.Nivel
            FROM estudiante
            INNER JOIN estudiante_en_grupo ON estudiante.Id = estudiante_en_grupo.estudianteId
            INNER JOIN grupo ON grupo.Id = estudiante_en_grupo.grupoId
            LEFT JOIN pago ON estudiante_en_grupo.Id = pago.estudianteEnGrupoId
            LEFT JOIN categoria_pago ON categoria_pago.Id = pago.categoriaPagoId
            LEFT JOIN medio_de_pago ON medio_de_pago.Id = pago.medioDePagoId
            LEFT JOIN grupo_modulo ON pago.grupoModuloId = grupo_modulo.Id
            LEFT JOIN modulo ON grupo_modulo.moduloId = modulo.Id
            LEFT JOIN curso ON grupo.cursoId = curso.Id
            LEFT JOIN tipo_grupo ON grupo.tipoGrupoId = tipo_grupo.Id
            LEFT JOIN nivel ON curso.nivelId = nivel.Id
            WHERE
            (pago.Estado = true OR pago.Estado IS NULL)
            AND (categoria_pago.Id = 1 OR categoria_pago.Id = 4 OR categoria_pago.Id IS NULL)
            AND grupo.Estado = 1
            AND (
                SELECT estado_grupo.Id
                FROM estado_grupo
                WHERE estado_grupo.Id = grupo.estadoGrupoId
            ) != 3
            AND estudiante.Documento = '${Documento}' AND estudiante.TipoDocumento = '${TipoDocumento}';
        `);

        await queryRunner.commitTransaction();
        return estudiante;
    }catch (e) {
        console.log("Error consulta pagos mensualidad estudiante: ", e);
        await queryRunner.rollbackTransaction();
        throw new Error(e);
    } finally {
        await queryRunner.release();
    }
}

const historialMoraEstudiante = async (dataSource:DataSource, TipoDocumento:string, Documento:string) => {

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const estudiante = await queryRunner.query(`
        SELECT
            grupo.Id AS grupoId,
            estudiante.Nombres,
            estudiante.ApellidoPaterno,
            estudiante.ApellidoMaterno,
            mora.MontoMora,
            mora.Verificado AS mora_verificada,
            modulo.Modulo,
            curso.NombreCurso AS cursoNombre,
            tipo_grupo.NombreGrupo AS tipoGrupoNombre,
            nivel.Nivel
            FROM estudiante
            INNER JOIN estudiante_en_grupo ON estudiante.Id = estudiante_en_grupo.estudianteId
            INNER JOIN grupo ON grupo.Id = estudiante_en_grupo.grupoId
            LEFT JOIN mora ON estudiante_en_grupo.Id = mora.estudianteEnGrupoId
            LEFT JOIN grupo_modulo ON mora.grupoModuloId = grupo_modulo.Id
            LEFT JOIN modulo ON grupo_modulo.moduloId = modulo.Id
            LEFT JOIN curso ON grupo.cursoId = curso.Id
            LEFT JOIN tipo_grupo ON grupo.tipoGrupoId = tipo_grupo.Id
            LEFT JOIN nivel ON curso.nivelId = nivel.Id
            WHERE grupo.Estado = 1 AND
            mora.EstadoMora = true
            AND (
                SELECT estado_grupo.Id
                FROM estado_grupo
                WHERE estado_grupo.Id = grupo.estadoGrupoId
            ) != 3
            AND estudiante.Documento = '${Documento}' AND estudiante.TipoDocumento = '${TipoDocumento}';
        `);

        await queryRunner.commitTransaction();
        return estudiante;
    }catch (e) {
        console.log("Error consulta historial mora estudiante: ", e);
        await queryRunner.rollbackTransaction();
        throw new Error(e);
    } finally {
        await queryRunner.release();
    }
}

const consultaCursos = async (dataSource:DataSource, NombreCurso:string, NivelCurso='') => {

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const firstQuery = `SELECT curso.NombreCurso, 
                            nivel.Nivel, 
                            modulo.Modulo, 
                            curso.DescripcionCurso,
                            curso.LinkRequisitos FROM curso 
                        INNER JOIN nivel on nivel.Id = curso.nivelId
                        INNER JOIN modulo on modulo.Id = curso.moduloId
                        WHERE curso.Estado = true AND curso.EstadoApertura = true AND curso.NombreCurso = '${NombreCurso}';`;
    const secondQuery = `SELECT curso.NombreCurso, 
                            nivel.Nivel, 
                            modulo.Modulo, 
                            curso.DescripcionCurso,
                            curso.LinkRequisitos FROM curso 
                        INNER JOIN nivel on nivel.Id = curso.nivelId
                        INNER JOIN modulo on modulo.Id = curso.moduloId
                        WHERE curso.Estado = true AND curso.EstadoApertura = true AND curso.NombreCurso = '${NombreCurso}' AND nivel.Nivel = '${NivelCurso}';`;
    try {
        const cursos = await queryRunner.query(NivelCurso?secondQuery:firstQuery);
        await queryRunner.commitTransaction();
        return cursos;
    }catch (e) {
        console.log("Error lista de cursos: ", e);
        await queryRunner.rollbackTransaction();
        throw new Error(e);
    } finally {
        await queryRunner.release();
    }
}




