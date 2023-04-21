import { FileValidator } from "@nestjs/common"
import * as fs from "fs-extra";

export class MaxFileSize extends FileValidator<{ maxSize: number }>{

    constructor(options: { maxSize: number }) {
      super(options)
    }
  
    isValid(file: Express.Multer.File): boolean | Promise<boolean> {
      const in_mb = file.size / 1000000;
      return in_mb <= this.validationOptions.maxSize
    }
    
    buildErrorMessage(): string {
      return `Tamaño máximo permitido ${this.validationOptions.maxSize} MB`
    }
    
  }