import dialogflow from "@google-cloud/dialogflow";
import { config } from "src/config/config";

const credentials = {
  client_email: config.GOOGLE_CLIENT_EMAIL,
  private_key: config.GOOGLE_PRIVATE_KEY,
};

const sessionClient = new dialogflow.SessionsClient({
  projectId: config.GOOGLE_PROJECT_ID,
  credentials,
});

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
export const sendToDialogFlow = async (msg:string, session:string, params:any = undefined) => {

  const textToDialogFlow = msg;

  try {
    const sessionPath = sessionClient.projectAgentSessionPath(
      config.GOOGLE_PROJECT_ID,
      session
    );

    const request:any = {
      session: sessionPath,
      queryInput: {
        text: {
          text: textToDialogFlow,
          languageCode: config.DF_LANGUAGE_CODE,
        },
      },
      queryParams: {
        payload: {
          data: params,
        },
      },
    };
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    console.log("INTENT EMPAREJADO: ", result.intent.displayName);
    const defaultResponses:any = [];

    if (result.action !== "input.unknown") {
      result.fulfillmentMessages.forEach((element) => {
        defaultResponses.push(element);
      });
    }
    
    if (defaultResponses.length === 0) {
      result.fulfillmentMessages.forEach((element) => {
        if (element.platform === "PLATFORM_UNSPECIFIED") {
          defaultResponses.push(element);
        }
      });
    }
    result.fulfillmentMessages = defaultResponses;

    // console.log(JSON.stringify(result, null,' '));
    return result;
    // console.log("se enviara el resultado: ", result);
  } catch (e) {
    console.log("error");
    console.log(e);
  }
}
