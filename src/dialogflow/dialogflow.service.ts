import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IntentsClient, SessionsClient, EntityTypesClient } from '@google-cloud/dialogflow';
import { HandleDialogFlow } from 'src/class/global-handles';
import { DialogFlowTextDto } from './dto/dialogflow-message.dto';
import { DialogFlowPayloadDto } from './dto/dialogflow-payload.dto';

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
          throw new InternalServerErrorException('Error get one intent')  
        }
    }

    async updateOneTxtIntent(uuid:string, dialogFlowTextDto:DialogFlowTextDto) {
        try {
            const name = `projects/ceidbot-bjpe/agent/intents/${uuid}`;
            const intentsClient  = new IntentsClient({ 
                keyFilename:this.keyFilename
            });
            const [intent] = await intentsClient.getIntent({ name });
            // puede que el mensaje venga en el 0 || 1
            if (intent.messages.some((message) => message.text)) {
                // Actualizar el primer mensaje de texto encontrado
                const textMessage = intent.messages.find((message) => message.text);
                textMessage.text.text = dialogFlowTextDto.text;
              } else {
                // Insertar un nuevo mensaje de texto
                intent.messages.push({ text: { text: dialogFlowTextDto.text } });
              }

            const result = await intentsClient.updateIntent({
                intent,
                languageCode:'es',
                intentView:'INTENT_VIEW_FULL',
                updateMask:{
                    paths: ['messages','messages.text.text']
                }
            });
            return new HandleDialogFlow('Posibles frases de respuesta del intent actualizado correctamente', true, result)
        } catch (e) {
            console.log(e)
          throw new InternalServerErrorException('Error update txt intent')  
        }
    }

    async updateOnePayloadIntent(uuid:string, dialogFlowPayloadDto:DialogFlowPayloadDto) {
        try {
            const name = `projects/ceidbot-bjpe/agent/intents/${uuid}`;
            const intentsClient  = new IntentsClient({ 
                keyFilename:this.keyFilename
            });
            const [intent] = await intentsClient.getIntent({ name });
            const newPayload = { fields:dialogFlowPayloadDto }
            // Verificar si hay un payload existente
            const existingPayloadIndex = intent.messages.findIndex((message) => message.payload);
            if (existingPayloadIndex !== -1) {
                // Actualizar el payload existente
                intent.messages[existingPayloadIndex].payload = newPayload as any;
            } else {
                // Insertar un nuevo payload
                intent.messages.push({ payload: { fields: dialogFlowPayloadDto as any } });
            }

            const result = await intentsClient.updateIntent({
                intent,
                languageCode:'es',
                intentView:'INTENT_VIEW_FULL',
                updateMask:{
                    paths: ['messages','messages.payload']
                }
            });
            return new HandleDialogFlow('Posibles frases de respuesta del intent actualizado correctamente', true, result)
        } catch (e) {
            console.log(e)
          throw new InternalServerErrorException('Error update payload intent')  
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
