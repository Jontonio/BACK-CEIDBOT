import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { DialogflowService } from './dialogflow.service';
import { DialogFlowTextDto } from './dto/dialogflow-message.dto';
import { DialogFlowPayloadDto } from './dto/dialogflow-payload.dto';

@Controller('dialogflow')
export class DialogflowController {
  constructor(private readonly dialogflowService: DialogflowService) {}

  @Get('get-all-entities')
  async listEntities() {
    return this.dialogflowService.getEntities();
  }
  
  @Get('get-one-intent/:uuid')
  async getOneIntent(@Param('uuid') uuid: string) {
    return this.dialogflowService.getOneIntent(uuid);
  }

  @Get('get-all-intents')
  async listIntents() {
    return this.dialogflowService.getIntents();
  }

  @Patch('update-one-txt-intent/:uuid')
  async updateOneTextIntent(@Param('uuid') uuid: string, @Body() dialogFlowTextDto:DialogFlowTextDto) {
    return this.dialogflowService.updateOneTxtIntent(uuid, dialogFlowTextDto);
  }

  @Patch('update-one-payload-intent/:uuid')
  async updateOnePayloadIntent(@Param('uuid') uuid: string, @Body() dialogFlowPayloadDto:DialogFlowPayloadDto) {
    return this.dialogflowService.updateOnePayloadIntent(uuid, dialogFlowPayloadDto);
  }

}
