
class MessageStatusBot{
    constructor(public title:string, public description:string, public qr:string, public isAuth:boolean, public showQr?:boolean){}
}
interface ClientInfo {
  pushname: string;
  wid: Wid;
  me: Wid;
  phone: undefined;
  platform: string;
}

interface Wid {
  server: string;
  user: string;
  _serialized: string;
}

export { MessageStatusBot, ClientInfo };