import { GoogleGenAI } from "@google/genai";
import type { Request, Response } from "express";

const API_KEY = process.env.GOOGLE_API_KEY!
const genAi = new GoogleGenAI({ apiKey: API_KEY })

export async function GenerateContent(req: Request, res: Response) {
    try {
        const { prompt } = req.body;
        const result = await genAi.models.generateContentStream({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })

        let response = '';

        for await (const chunk of result) {
            response += chunk.text
        }

        return res.status(200).json({
            success: true,
            message: response
        })


    } catch (error) {
        console.log(error);
    }
}