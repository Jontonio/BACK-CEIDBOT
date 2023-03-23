import { sendToDialogFlow } from "./dialogflow";
import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js"
import { PayloadBoot } from '../class/PayloadBoot';
import { CursoService } from "src/curso/curso.service";
import { isArray } from "class-validator";

export const chatbot = async (client:Client, message:WAWebJS.Message, _curso:CursoService) => {

    const res:any = await sendToDialogFlow(message.body, message.from );   

    for(const response of res.fulfillmentMessages){

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

                const intentUbicacion = res.intent.displayName;
                
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

    const cursos = await _curso.CursosMatricula({limit:100, offset:0});
    const payload:PayloadBoot = response.payload.fields;

    let lista = 'Estos son los cursos aperturados:\n';
    if(isArray(cursos.data)){
        if(cursos.data.length==0){
            await client.sendMessage(message.from,`😬 Disculpa, Por el momento no tenemos cursos aperturados`);   
            return;
        }
        cursos.data.forEach(curso => {
            lista += `°📙 *${curso.NombreCurso.toUpperCase()}* - nivel ${curso.NivelCurso} \n`;
        })
    }
    await client.sendMessage(message.from, lista);
    if(payload.media.stringValue){
        const media = await prepareMedia(payload);
        await client.sendMessage(message.from, media);
    }
} 

const sendDefaultResponse = async (client:Client, message:WAWebJS.Message, response:any) => {
    const payload:PayloadBoot = response.payload.fields;
    await client.sendMessage(message.from, `${payload.message.stringValue}`)
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
