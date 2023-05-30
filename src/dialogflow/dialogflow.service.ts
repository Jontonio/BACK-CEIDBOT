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
    
   /**
    * This function retrieves a list of intents from DialogFlow using the provided keyFilename and
    * projectId.
    * @returns an instance of the `HandleDialogFlow` class with a message, a boolean value indicating
    * success or failure, and the data obtained from the DialogFlow API. The message is "Lista de
    * intents", the boolean value is `true`, and the data is either the first intent in the list of
    * intents obtained from the API or an empty array if the list is empty.
    */
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
            console.log(e.message)
          throw new InternalServerErrorException('ERROR OBTENER LISTA INTENTS')  
        }
    }

   /**
    * This is an async function that retrieves a single intent from DialogFlow using its UUID.
    * @param {string} uuid - The `uuid` parameter is a string that represents the unique identifier of
    * an intent in Dialogflow. It is used to retrieve information about a specific intent from the
    * Dialogflow API.
    * @returns A `HandleDialogFlow` object with the result of the `getIntent` method from the
    * `IntentsClient` class, which contains information about the intent with the specified UUID. If
    * the intent is found, the `success` property of the `HandleDialogFlow` object will be `true` and
    * the `data` property will contain the intent information. If the intent is not found,
    */
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
            console.log(e.message)
          throw new InternalServerErrorException('ERROR OBTENER EL INTENT')  
        }
    }

    /**
     * This function updates a text message in a DialogFlow intent or adds a new one if none exist.
     * @param {string} uuid - The `uuid` parameter is a string representing the unique identifier of
     * the intent that needs to be updated in DialogFlow.
     * @param {DialogFlowTextDto} dialogFlowTextDto - `dialogFlowTextDto` is an object that contains
     * the text message to be updated or inserted in a DialogFlow intent. It has the following
     * properties:
     * @returns a `HandleDialogFlow` object with a message indicating that the possible response
     * phrases of the updated intent have been updated successfully, a boolean value of `true`
     * indicating success, and the result of the update operation.
     */
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
            console.log(e.message)
          throw new InternalServerErrorException('Error update txt intent')  
        }
    }

   /**
    * This function updates the payload of a DialogFlow intent with the provided UUID and payload DTO.
    * @param {string} uuid - The UUID (Universally Unique Identifier) of the intent that needs to be
    * updated.
    * @param {DialogFlowPayloadDto} dialogFlowPayloadDto - `dialogFlowPayloadDto` is an object of type
    * `DialogFlowPayloadDto` which contains the fields to be updated in the DialogFlow intent's
    * payload. The fields can include text, images, cards, etc. that will be used as responses by the
    * intent.
    * @returns a `HandleDialogFlow` object with a message indicating whether the update of the intent's
    * payload was successful or not, and the result of the update operation.
    */
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
            console.log(e.mensaje)
          throw new InternalServerErrorException('ERROR ACTUALIZAR PAYLOAD INTENT')  
        }
    }
    
    /**
     * This function retrieves a list of entities from DialogFlow using the DialogFlow API client
     * library for Node.js.
     * @returns The `getEntities()` function is returning a `HandleDialogFlow` object with the message
     * "Lista de entities", a boolean value of `true`, and the data obtained from a call to the
     * Dialogflow API to list all entity types in the project.
     */
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
            console.log(e.mensaje)
            throw new InternalServerErrorException('ERRO LIST INTENTS');
        }
    }

}
