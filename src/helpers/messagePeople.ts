import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js";
import * as moment from 'moment';
import axios from 'axios';
import { Image } from "src/class/Image";


export const onMessageObjects = async (client:Client, message:WAWebJS.Message) => {
    
    // Buscar: objeto
    const { body } = message;
    const key = '18495173-29b6f4b8f08b75bad50a8f930'
    const ejemplo = body.toLowerCase();
    
    if(ejemplo.includes('buscar') && ejemplo.includes(':')){

        const [ ,termino] = ejemplo.split(':');

        const response  = await axios.get(`https://pixabay.com/api/?key=${key}&q=${termino}&image_type=photo`);
        const { hits } = response.data;
        const images:Image[] = hits;

        if(images.length > 0){
            const index = Math.floor(Math.random() * (images.length)/2);
            const { largeImageURL } = images[index];
    
            const media = await MessageMedia.fromUrl(largeImageURL);
            media.mimetype = "image/png";
            media.filename = "wii.png";
    
            const res = await client.sendMessage(message.from, media, {caption: termino });
        }else {
            const res = await client.sendMessage(message.from,`No se encontraron datos con el termino ${termino}`);
        }
    }

}

export const onMessagePeople = async (client:Client, message:WAWebJS.Message) => {
    
    const { body } = message;

    if(body.toLowerCase()=='dime la fecha'){
        sendFecha(client, message);
    }

    if(body.toLowerCase()=='mi dni'){
        sendDNIInfo(client, message);
    }

    if(!isNaN(parseInt(body)) && body.length==8){
        const dni:string = body;
        try {
            const hoy = moment().format('dddd Do MMMM YYYY, h:mm:ss a');
            const data = await axios.get(`https://api.apis.net.pe/v1/dni?numero=${dni}`);
            await client.sendMessage(message.from,`Hola 👋 mucho gusto ${data.data.nombres},\n *Datos completos:* ${data.data.nombre} \n *Fecha de consulta:* ${hoy}`).then( res => {
                console.log("Mensaje de fecha enviada correctamente");
            }).catch( error => {
                console.log('Hubo un error al enviar la fecha');
            })
        } catch (error) {
            client.sendMessage(message.from,`No se encontro los datos para el ${dni} 😥`).then( res => {
                console.log("Mensaje de fecha enviada correctamente");
            }).catch( error => {
                console.log('Hubo en la consulta de DNI');
            })
        }
    }
}

const sendFecha = (client:Client, message:WAWebJS.Message) => {

    const hoy = moment().format('dddd Do MMMM YYYY');
    client.sendMessage(message.from,`*Hola 🐰 la fecha es:* ${hoy}`).then( res => {
        console.log("Mensaje de fecha enviada correctamente");
    }).catch( error => {
        console.log('Hubo un error al enviar la fecha');
    })

}

const sendDNIInfo = async (client:Client, message:WAWebJS.Message) => {
    await message.reply("🚀 Muy bien digite su número de DNI: ");
}