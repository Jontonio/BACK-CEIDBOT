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
                        const payload1:PayloadBoot = response.payload.fields;
                        await client.sendMessage(message.from, `${payload1.message.stringValue} ${payload1.link.stringValue}`, {linkPreview:true})
                        break;
                    case 'consulta_pagos':
                        const payload2:PayloadBoot = response.payload.fields;
                        const media = await MessageMedia.fromUrl(payload2.link.stringValue);
                        media.mimetype = "image/png";
                        media.filename = "Información de pagos.png";
                        await client.sendMessage(message.from, media);
                        break;
                    case 'consulta_cursos':
                        const cursos = await _curso.CursosMatricula({limit:100, offset:0});
                        let lista = '';
                        if(isArray(cursos.data)){
                            cursos.data.forEach(curso => {
                                lista += `°📙 ${curso.NombreCurso.toUpperCase()} - nivel ${curso.NivelCurso} \n`;
                            })
                        }
                        await client.sendMessage(message.from, lista);
                    default:
                        break;
                }
                    
            }, 1000);
        }
    
        // if(res.parameters.fields.dni){
        //     const dni = res.parameters.fields.dni.numberValue
        //     onMessagePeople(client, message, dni);
        // }

        // if(res.intent.displayName=='respuesta_usuario'){

        //     if(res.parameters.fields.email){
        //         const email = res.parameters.fields.email.stringValue;
        //         if(email){
        //             const user = await User.findOne({where:{email:email}});
        //             if(user){
        //                 setTimeout(async () => {
        //                     await client.sendMessage(message.from,`Este usuario le corresponde a:\n *Nombres:* ${user.dataValues.name}\n *Apellidos:* ${user.dataValues.lastName}\n *Fecha de creación:* ${user.dataValues.createdAt}`);
        //                 }, 8000);
        //             }else{

        //                 setTimeout(async () => {
        //                     await client.sendMessage(message.from,`😔 No se encontraron datos para el usuario ${email}`);
        //                 }, 8000);
        //             }
        //         }else{
        //             await client.sendMessage(message.from,"🤕 Por favor digite un email válido....");
        //         }
        //     }
        // }

        
    }
    
}