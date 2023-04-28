// import { Configuration, OpenAIApi } from 'openai';
import { ChatGPTAPI } from 'chatgpt'


const API_KEY = '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'
// const configuration = new Configuration({
//   apiKey:'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',
// });

const api = new ChatGPTAPI({
  apiKey: API_KEY,
  completionParams: {
    model:'text-davinci-003',
    temperature: 0.5,
    top_p: 0.8
  }
})

export const GPT = async ( msg:string ) => {

    // const openai = new OpenAIApi(configuration);
    
    // const completion = await openai.createCompletion({
    //   model: 'text-davinci-003',
    //   prompt: msg,
    // });

    // return completion.data.choices[0].text;
  
    const res = await api.sendMessage( msg, {
      systemMessage:'Tu nombre es CEIDBOT, un chatbot entrenado para responder preguntas o consutas de las personas, las preguntas tienen que ser relacionado a cursos, cursos de idiomas, horarios y ubicación'
    })

    console.log(res.text)
    return res.text;
}

