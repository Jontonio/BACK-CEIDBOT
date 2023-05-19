import { IsOptional } from "class-validator";
import { Description_media } from "src/class/PayloadBoot";
import { Link, Media } from "src/class/PayloadBoot";
import { Message } from "src/class/PayloadBoot";

export class DialogFlowPayloadDto{

    @IsOptional()
    message:Message;

    @IsOptional()
    media:Media;

    @IsOptional()
    link:Link;

    @IsOptional()
    description_media:Description_media;
} 