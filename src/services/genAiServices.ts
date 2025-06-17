import { GoogleGenAI } from "@google/genai"
import type { Doctor, GetDoctorsParams, Message, Tools } from "../../types/types";
import { healthTools } from "../config/agent.tools";
import { FUNCTION_CALL_PROMPT, generateDoctorResponsePrompt, getArgumentsForFunctionCall, SYSTEM_PROMPT } from "../config/prompts";
import { safeJsonParse } from "../config/safe.json.parse";


class GenAIService {
    private genAI: GoogleGenAI
    private tools: Record<string, Tools>

    constructor() {

        const API_KEY = process.env.GOOGLE_API_KEY;
        this.genAI = new GoogleGenAI({ apiKey: API_KEY });
        this.tools = healthTools
    }

    async *generateContentStream(prompt: string, history?: Message[]) {
        try {

            const formattedHistory = (history ?? [])
                .map((msg) => `${msg.isUser ? "User" : "AI"}: ${msg.text}`)
                .join('\n')

            const system_prompt = SYSTEM_PROMPT
                +
                `\n Conversation History:
                ${formattedHistory}`

            // MODEL 1

            // # MODEL CALL FOR CHECKING WHICH FUNCTION TO CALL OR NOT
            const function_call = await this.genAI.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: [
                    { role: 'model', parts: [{ text: FUNCTION_CALL_PROMPT }] },
                    { role: 'user', parts: [{ text: prompt }] }
                ]
            })

            // model's result to call which function
            const function_to_call = function_call.candidates?.[0]?.content?.parts?.[0]?.text?.split(':')[1]?.trim() || undefined
            // console.log(function_to_call)

            // #Properties of a function that we have to pass in the arguments
            // TODO : HANDLE THE CASE WHEN THIS IS PROPERTY IS AN EMPTY OBJECT
            let properties_of_function_call


            if (function_to_call) {
                console.log(function_to_call)
                properties_of_function_call = this.tools[function_to_call || '']?.parameter?.properties ?? 'no properties found'
                // console.log(properties_of_function_call)

                const PARAMETER_EXTRACTION_PROMPT = getArgumentsForFunctionCall(properties_of_function_call, prompt)

                // console.log(PARAMETER_EXTRACTION_PROMPT)

                // MODEL 2

                // #CALL FOR TAKING THE PARAMETERS TO PASS IN THE FUNCTION FROM THE USER

                const arguments_to_pass_to_handler_function = await this.genAI.models.generateContent({
                    model: 'gemini-2.0-flash',
                    contents: [
                        { role: 'user', parts: [{ text: PARAMETER_EXTRACTION_PROMPT }] }
                    ]
                })

                // console.log(JSON.parse(arguments_to_pass_to_handler_function?.candidates?.[0]?.content?.parts?.[0]?.text!) || '')
                const argumentsResponse: GetDoctorsParams = safeJsonParse(arguments_to_pass_to_handler_function?.candidates?.[0]?.content?.parts?.[0]?.text!)
                // console.log(argumentsResponse.name)
                // console.log(argumentsResponse.specialization)
                // console.log(argumentsResponse.fee)

                console.log(argumentsResponse)

                if (!argumentsResponse) return;

                const doctorsResult = await this.tools[function_to_call || '']?.handler(argumentsResponse)

                console.log('got the doctors result')

                const { doctors } = doctorsResult

                if (doctors.length > 0) {
                    const DOCTOR_RESPONSE_PROMPT = generateDoctorResponsePrompt(doctors as Doctor[], prompt)

                    // # MODEL 3

                    // sending the respone of 

                    const finalResponse = await this.genAI.models.generateContentStream({
                        model: 'gemini-2.0-flash',
                        contents: [
                            { role: 'model', parts: [{ text: DOCTOR_RESPONSE_PROMPT }] }
                        ]
                    })

                    for await (const chunk of finalResponse) {
                        yield chunk.text
                    }
                }


            }

            else {

                const response = await this.genAI.models.generateContentStream({
                    model: 'gemini-2.0-flash',
                    contents: [
                        { role: 'model', parts: [{ text: system_prompt }] },
                        { role: 'user', parts: [{ text: prompt }] },
                    ],
                })

                for await (const chunk of response) {
                    yield chunk.text;
                }
            }
            // console.log(formattedHistory)


        } catch (error) {
            console.log(error)
        }
    }

    async getter() {

    }
}

export const genAIService = new GenAIService()




// #GENERATIVE FUNCTION EXAMPLE

// function* generative(): any {
//     console.log("generation started");

//     const val1 = yield "first pause";
//     console.log("resumed with : ", val1)

//     const val2 = yield "second pause";
//     console.log("resumed with : ", val2);

//     return "done"
// }

// const gen = generative()

// console.log(gen.next());
// console.log(gen.next('hello'));
// console.log(gen.next('hello again'));

