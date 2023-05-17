import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IntentsClient, SessionsClient, EntityTypesClient } from '@google-cloud/dialogflow';
import { HandleDialogFlow } from 'src/class/global-handles';
import { DialogFlowTextDto } from './dto/dialogflow-message.dto';

@Injectable()
export class DialogflowService {
    
    private readonly sessionClient: SessionsClient;
    projectId:string;
    keyFilename:string;

    constructor(){
        this.projectId = process.env.GOOGLE_PROJECT_ID;
        this.keyFilename = process.env.PATH_FILE_CEID_DIALOG_FLOW;
        this.sessionClient = new SessionsClient({
            keyFilename:this.keyFilename
        });
    }
    
    async getIntents() {
        try {
            const intentsClient  = new IntentsClient({ 
                keyFilename:this.keyFilename
            });
            const projectAgentPath = this.sessionClient.projectAgentPath(this.projectId);
            const request = { parent: projectAgentPath };
            const  res = await intentsClient.listIntents(request);
            const data = (res.length > 0)?res[0]:[];
            return new HandleDialogFlow('Lista de intens', true, data)
        } catch (e) {
            console.log(e)
          throw new InternalServerErrorException('Error get list intens')  
        }
    }

    async getOneIntent(uuid:string) {
        try {
            const name = `projects/ceidbot-bjpe/agent/intents/${uuid}`;
            const intentsClient  = new IntentsClient({ 
                keyFilename:this.keyFilename
            });
            const res = await intentsClient.getIntent({ name });
            const data = (res.length > 0)?res[0]:[];
            return new HandleDialogFlow('get on intent', true, data)
        } catch (e) {
            console.log(e)
          throw new InternalServerErrorException('Error get list intens')  
        }
    }

    async updateOneTxtIntent(uuid:string, dialogFlowTextDto:DialogFlowTextDto) {
        try {
            const name = `projects/ceidbot-bjpe/agent/intents/${uuid}`;
            const intentsClient  = new IntentsClient({ 
                keyFilename:this.keyFilename
            });
            const [intent] = await intentsClient.getIntent({ name });
            intent.messages[0].text.text = dialogFlowTextDto.text;
            const result = await intentsClient.updateIntent({
                intent,
                languageCode:'es',
                intentView:'INTENT_VIEW_FULL',
            });
            return new HandleDialogFlow('Posibles frases de respuesta del intent actualizado correctamente', true, result)
        } catch (e) {
            console.log(e)
          throw new InternalServerErrorException('Error get list intens')  
        }
    }
    
    async getEntities() {
        try {
            const entityTypesClient  = new EntityTypesClient({ 
                keyFilename:this.keyFilename
            });
            const projectAgentPath = this.sessionClient.projectAgentPath(this.projectId);
            const request = { parent: projectAgentPath };
            const data = await entityTypesClient.listEntityTypes(request);
            return new HandleDialogFlow('Lista de entities', true, data)
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException('Error get all entities');
        }
    }

}
