import { PartialType } from "@nestjs/mapped-types";
import { ConfigNotificacionDto } from "./configNotification.dto copy";

export class UpdateConfigNotificacionDto extends PartialType(ConfigNotificacionDto) {}
