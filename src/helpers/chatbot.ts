import { sendToDialogFlow } from "./dialogflow";
import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js"
import { PayloadBoot, PayloadCurso } from '../class/PayloadBoot';
import { DataSource } from "typeorm";

export const chatbot = async (client:Client, message:WAWebJS.Message, dataSource:DataSource) => {

    const resGlobal = await sendToDialogFlow(message.body, message.from );   

    for(const response of resGlobal.fulfillmentMessages){

        // TODO: Enviar texto de respuesta : enviar resuesta txt
        if(response.text){
            client.sendMessage(message.from, response.text.text[0]).then( res => {
                console.log("mensaje enviado");
            }).catch( error => {
                console.log(error)
            })
        }

        // TODO: Enviar data en base a intents_especificos
        // if(response.payload){
        //     const intentUbicacion = resGlobal.intent.displayName;
        //     setTimeout(() => {
        //         switch (intentUbicacion) {
        //             case 'consulta_cursos':
        //                 sendCursos(client, message, dataSource);
        //                 break;
        //             case 'consulta_curso_especifico':
        //                 sendCursoEspecifico(client, message, resGlobal.parameters);
        //                 break;
        //             case 'pedido_documento':
        //                 console.log(JSON.stringify(response))
        //                 console.log("\n")
        //                 console.log(JSON.stringify(resGlobal))
        //                 break;
        //         }
        //     }, 1000);
        // }
        
        // TODO: Verificar si existe un payload para enviar
        // if(response.payload){
        //     setTimeout(async() => {
        //         existPayload(client, message, response.payload.fields)
        //     }, 1000);
        // }

    }
    
}

const prepareMedia = async (payload:PayloadBoot) => {
    return await MessageMedia.fromUrl(payload.media.stringValue);
}

const existPayload = async (client:Client, message:WAWebJS.Message, payload:PayloadBoot | any) =>{
    try {
        console.log("tiene payload")
        // let msg:string;
        // if(payload.message.stringValue!="" && payload.link.stringValue!=""){
        //     msg = `${payload.message.stringValue} 👉 ${payload.link.stringValue}`;
        // }else if(payload.message.stringValue){
        //     msg = `${payload.message.stringValue}`;
        // }else if(payload.link.stringValue){
        //     msg = `${payload.message.stringValue}`;
        // }
        // await client.sendMessage(message.from, msg);
        // if(payload.media.stringValue){
        //     const caption = payload.description_media.stringValue;
        //     const media = await prepareMedia(payload);
        //     await client.sendMessage(message.from, media,{ caption });
        // }
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
    // console.log("curso: ", NombreCurso,"Nivel:", (NivelCurso)?NivelCurso:'no existe')
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




