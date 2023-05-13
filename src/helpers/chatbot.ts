import { sendToDialogFlow } from "./dialogflow";
import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js"
import { PayloadBoot, PayloadCurso } from '../class/PayloadBoot';
import { CursoService } from "src/curso/curso.service";
import { isArray } from "class-validator";

export const chatbot = async (client:Client, message:WAWebJS.Message, _curso:CursoService) => {

    const resGlobal:any = await sendToDialogFlow(message.body, message.from );   

    for(const response of resGlobal.fulfillmentMessages){

        // TODO: Send text
        if(response.text){
            client.sendMessage(message.from, response.text.text[0]).then( res => {
                console.log("mensaje enviado");
            }).catch( error => {
                console.log(error)
            })
        }

        //TODO: Send payload
        if(response.payload){
            setTimeout(async () => {

                const intentUbicacion = resGlobal.intent.displayName;
                
                switch (intentUbicacion) {
                    case 'consulta_ubicacion':
                        sendUbicacion(client, message, response);
                        break;
                    case 'consulta_precios':
                        sendPrecios(client, message, response);
                        break;
                    case 'consulta_cursos':
                        sendCursos(client, message, response, _curso);
                        break;
                    case 'consulta_curso_especifico':
                        sendCursoEspecifico(client, message, resGlobal, _curso);
                        break;
                    case 'consulta_medios_pago':
                        sendMediosPago(client, message, response);
                        break;
                    case 'consulta_horario':
                        sendHorario(client, message, response);
                        break;
                    case 'consulta_matricula':
                        sendMatricula(client, message, response);
                        break;
                    case 'Default_response':
                        sendDefaultResponse(client, message, response);
                        break;
                    default:
                        break;
                }
                    
            }, 1000);
        }
    }
    
}

const prepareMedia = async (payload:PayloadBoot) => {
    const media = await MessageMedia.fromUrl(payload.media.stringValue);
    media.mimetype = payload.type_media.stringValue;
    media.filename = payload.name_media.stringValue;
    return media;
}

const sendCursos = async (client:Client, message:WAWebJS.Message, response:any, _curso:CursoService) => {

    const cursos = await _curso.cursosInscripcion();
    const payload:PayloadBoot = response.payload.fields;

    let lista = 'Estos son los cursos aperturados:\n';
    if(isArray(cursos.data)){
        if(cursos.data.length==0){
            await client.sendMessage(message.from,`😬 Disculpa, Por el momento no tenemos cursos aperturados`);   
            return;
        }
        cursos.data.forEach(curso => {
            lista += `°📙 *${curso.NombreCurso.toUpperCase()}* - nivel ${curso.nivel.Nivel} \n`;
        })
        lista +=`👉 Escriba su curso de preferencia...`;
    }
    await client.sendMessage(message.from, lista);
    if(payload.media.stringValue){
        const media = await prepareMedia(payload);
        await client.sendMessage(message.from, media,{ caption: payload.message.stringValue });
    }
} 

const sendCursoEspecifico = async (client:Client, message:WAWebJS.Message, response:any, _curso:CursoService) => {
    // console.log(response)
    const payloadCurso:PayloadCurso = response.parameters.fields;
    // const payloadBot:PayloadBoot = response.fulfillmentMessages.payload.fields;
    const NombreCurso = payloadCurso.curso_especifico.stringValue;
    const NivelCurso = payloadCurso.nivel_curso.stringValue;

    if(!NombreCurso){
        await client.sendMessage(message.from,`😬 Disculpa, podría especificar la información del curso solicitado por favor?`);   
        return;
    }
    console.log("curso: ", NombreCurso,"Nivel:", (NivelCurso)?NivelCurso:'no existe')
    const cursos = await _curso.findByName(NombreCurso,(NivelCurso)?NivelCurso:'');

    let lista = '';

    if(cursos.length==0){
        await client.sendMessage(message.from,`😬 Disculpa, por el momento no tenemos información sobre el curso ${NombreCurso} ${NivelCurso}`);   
        return;
    }

    cursos.forEach(curso => {
        lista += `📘 *Curso:* ${curso.NombreCurso.toUpperCase()} \n 🎯 *Nivel del curso:* ${curso.nivel.Nivel} \n #️ *Módulos:* ${curso.modulo.Modulo} módulos \n 📝 *Descripción:* \n ${curso.DescripcionCurso} \n *👉 Link de los requisitos:* ${curso.LinkRequisitos}`;
    })
 
    await client.sendMessage(message.from, lista);

    // if(payloadBot.media.stringValue){
    //     const media = await prepareMedia(payloadBot);
    //     await client.sendMessage(message.from, media, {extra: payloadBot.message });
    // }
} 

const sendDefaultResponse = async (client:Client, message:WAWebJS.Message, response:any) => {
    const payload:PayloadBoot = response.payload.fields;
    await client.sendMessage(message.from, `${payload.message.stringValue}`)
    if(payload.media.stringValue){
        const media = await prepareMedia(payload);
        await client.sendMessage(message.from, media);
    }
} 
const sendMediosPago = async (client:Client, message:WAWebJS.Message, response:any) => {
    const payload:PayloadBoot = response.payload.fields;
    await client.sendMessage(message.from, `${payload.message.stringValue} ${payload.link.stringValue}`, {linkPreview:true})
    if(payload.media.stringValue){
        const media = await prepareMedia(payload);
        await client.sendMessage(message.from, media);
    }
}

const sendHorario = async (client:Client, message:WAWebJS.Message, response:any) => {
    const payload:PayloadBoot = response.payload.fields;
    await client.sendMessage(message.from, `${payload.message.stringValue} ${payload.link.stringValue}`, {linkPreview:true})
    if(payload.media.stringValue){
        const media = await prepareMedia(payload);
        await client.sendMessage(message.from, media);
    }
}

const sendMatricula = async (client:Client, message:WAWebJS.Message, response:any) => {
    const payload:PayloadBoot = response.payload.fields;
    await client.sendMessage(message.from, `${payload.message.stringValue} ${payload.link.stringValue}`, {linkPreview:true})
    if(payload.media.stringValue){
        const media = await prepareMedia(payload);
        await client.sendMessage(message.from, media);
    }
}

const sendUbicacion = async (client:Client, message:WAWebJS.Message, response:any) => {
    const payload:PayloadBoot = response.payload.fields;
    await client.sendMessage(message.from, `${payload.message.stringValue} ${payload.link.stringValue}`, {linkPreview:true})
    if(payload.media.stringValue){
        const media = await prepareMedia(payload);
        await client.sendMessage(message.from, media);
    }
}
const sendPrecios = async (client:Client, message:WAWebJS.Message, response:any) => {
    const payload:PayloadBoot = response.payload.fields;
    await client.sendMessage(message.from, `${payload.message.stringValue} ${payload.link.stringValue}`, {linkPreview:true})
    if(payload.media.stringValue){
        const media = await prepareMedia(payload);
        await client.sendMessage(message.from, media);
    }
}
