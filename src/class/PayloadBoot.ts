interface PayloadBoot {
  message: Message;
  media: Media;
  link: Link;
  description_media:Description_media;
}

interface Media {
  stringValue: string;
  kind: string;
}

interface Message {
  stringValue: string;
  kind: string;
}

interface Description_media {
  stringValue: string;
  kind: string;
}

interface Link {
  stringValue: string;
  kind: string;
}

interface PayloadCurso {
  nivel_curso: Nivelcurso;
  curso_especifico: Nivelcurso;
}

interface Nivelcurso {
  stringValue: string;
  kind: string;
}

export { PayloadBoot, PayloadCurso, Message, Media, Description_media, Link}