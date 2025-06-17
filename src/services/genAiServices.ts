import { GoogleGenAI } from "@google/genai"
import type { Message, Tools } from "../../types/types";
import { healthTools } from "../config/agent.tools";

const FUNCTION_CALL_PROMPT =
    `
You are an expert AI agent whose sole job is to read the user's request and choose exactly one function to call. Do not execute it—only indicate which function should be invoked.

Available functions:
- search_doctor: Search for doctors by name (partial or full), specialization, fee range, location, rating, experience, etc.
- book_doctor: Book an appointment with a specific doctor (requires doctor ID and slot details).
*(Add more functions here as needed.)*

When you receive a user prompt:
1. Identify the user's intent and any relevant parameters.
2. Select the single most appropriate function.
3. Ignore all unrelated details.

Respond **only** with the chosen function name, wrapped in backticks, in this exact format:
'function:<function_name>'

Examples:
User: “Can you suggest a general physician with fees under 600?”  
Agent:  
function:search_doctor

User: “I'd like to book an appointment with Dr. Ananya Das next Wednesday at 3 PM.”  
Agent:  
function:book_doctor

`

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

            const SYSTEM_PROMPT = `
            You are an intelligent agent representing Bajaj Finserv Health, a renowned leader in health technology. Your primary role is to provide precise, actionable health-related information, data, and guidance based on the user's questions. 

            • If the user's query is outside of health or related domains (e.g., finance, travel, general chitchat), politely remind them: “I specialize in health-tech topics—could you please rephrase your question to focus on health, wellness, or related services?”  
            • Even when users stray into other topics, do not lose sight of the main context; always steer them back to health-tech inquiries.  
            • You may handle simple greetings or pleasantries naturally, but quickly pivot back: “Hello! How can I assist you with your health-tech needs today?”  
            • Always maintain a professional, empathetic tone, and leverage the provided conversation history to keep context, continuity, and accuracy.  

            Conversation History:
            ${formattedHistory}`;

            // MODEL 1

            // # MODEL CALL FOR CHECKING WHICH FUNCTION TO CALL OR NOT
            const function_call = await this.genAI.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: [
                    { role: 'model', parts: [{ text: FUNCTION_CALL_PROMPT }] },
                    { role: 'user', parts: [{ text: prompt }] }
                ]
            })

            const function_to_call = function_call.candidates?.[0]?.content?.parts?.[0]?.text?.split(':')[1]?.trim()

            // #Properties of a function that we have to pass in the arguments
            const properties_of_function_call = this.tools[function_to_call || '']?.parameter?.properties

            // return;

            // console.log(formattedHistory)
            const response = await this.genAI.models.generateContentStream({
                model: 'gemini-2.0-flash',
                contents: [
                    { role: 'model', parts: [{ text: SYSTEM_PROMPT }] },
                    { role: 'user', parts: [{ text: prompt }] },
                ],
            })

            for await (const chunk of response) {
                yield chunk.text;
            }


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

