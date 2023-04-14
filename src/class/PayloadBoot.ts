interface PayloadBoot {
  message: Message;
  media: Media;
  link: Message;
  type_media: Type_media;
  description_media:Description_media;
  name_media:Name_media;
}

interface Media {
  stringValue: string;
  kind: string;
}

interface Message {
  stringValue: string;
  kind: string;
}

interface Type_media {
  stringValue: string;
  kind: string;
}
interface Description_media {
  stringValue: string;
  kind: string;
}
interface Name_media {
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

export { PayloadBoot, PayloadCurso }