import { GoogleGenAI } from "@google/genai"

class GenAIService {
    private genAI: GoogleGenAI

    constructor() {

        const API_KEY = process.env.GOOGLE_API_KEY;
        this.genAI = new GoogleGenAI({ apiKey: API_KEY })
    }

    async *generateContentStream(prompt: string) {
        try {

            const response = await this.genAI.models.generateContentStream({
                model: 'gemini-2.0-flash',
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            })

            for await (const chunk of response) {
                yield chunk.text;
            }

        } catch (error) {
            console.log(error)
        }
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

