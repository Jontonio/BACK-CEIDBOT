import { Client } from "whatsapp-web.js"
import * as moment from 'moment';


export const sendPaymentGirlFriend = (client:Client) => {

    const hoy = moment().format('dddd Do MMMM YYYY');
    const dia = moment().format("D");

    //! I need ichat of the group
    const idChat = '120363026636473509@g.us'; 

    if( parseInt(dia) % 2 == 0 ){

        const win = Math.floor(Math.random() * (10 - 5) + 5);
        const message = `Holaa 👋 buenas tardes ✨, hoy ${hoy} \n *Daira 🐼* y *José Antonio 🐰* \n tienen que pagar *s/. ${win}* \n`;
        console.log(message);
        client.sendMessage(idChat, message).then( res => {
            console.log('Mensaje enviado para pagar');
        }).catch( error => {
            console.log('Mensaje para pagar no enviado');
        });

    } else {

        client.sendMessage(idChat,`Hoy ${hoy} 😞 no toca pagar para nuestro viaje, pero mañana si 🥺`)
            .then( res => {
                console.log('Mensaje enviado para no realizar el pago');
            }).catch( error => {
                console.log('Mensaje no enviado para no realizar el pago');
            })
    }
};