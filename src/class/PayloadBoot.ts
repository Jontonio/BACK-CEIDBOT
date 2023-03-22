interface PayloadBoot {
  message: Message;
  media: Media;
  link: Message;
}

interface Media {
  stringValue: string;
  kind: string;
}

interface Message {
  stringValue: string;
  kind: string;
}

export { PayloadBoot }