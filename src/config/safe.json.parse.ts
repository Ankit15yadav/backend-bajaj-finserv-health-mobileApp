// utils/jsonParser.ts
export function safeJsonParse(jsonString: string): any {
    try {
        // Remove markdown code blocks if present
        let cleanedJson = jsonString.trim();

        // Remove ```json and ``` if present
        if (cleanedJson.startsWith('```json')) {
            cleanedJson = cleanedJson.replace(/^```json\s*/, '');
        }
        if (cleanedJson.startsWith('```')) {
            cleanedJson = cleanedJson.replace(/^```\s*/, '');
        }
        if (cleanedJson.endsWith('```')) {
            cleanedJson = cleanedJson.replace(/\s*```$/, '');
        }

        // Remove any leading/trailing whitespace
        cleanedJson = cleanedJson.trim();

        // Try to parse the cleaned JSON
        return JSON.parse(cleanedJson);
    } catch (error) {
        console.error('JSON Parse Error:', error);
        console.error('Original string:', jsonString);
        return {}; // Return empty object as fallback
    }
}

// Usage in your code:
// const argumentsResponse: GetDoctorsParams = safeJsonParse(
//     arguments_to_pass_to_handler_function?.candidates?.[0]?.content?.parts?.[0]?.text!
// );