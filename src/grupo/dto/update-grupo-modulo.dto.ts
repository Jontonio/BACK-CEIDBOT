import { PartialType } from "@nestjs/mapped-types";
import { CreateGrupoModuloDto } from "./create-grupo-modulo.dto copy";

export class UpdateGrupoModuloDto extends PartialType(CreateGrupoModuloDto) {}
