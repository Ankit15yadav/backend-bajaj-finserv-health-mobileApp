import type { GetDoctorsParams, Tools } from "../../types/types";
import { getDoctors } from "../services/doctor.service";

export const healthTools: Record<string, Tools> = {
    search_doctor: {
        name: 'search_doctor',
        description: "Search for doctors based on various criteria like name, specialization, fee range, location, rating, experience, etc. Use this when users ask to find doctors, search for specialists, or need doctor recommendations.",
        parameter: {
            type: "object",
            properties: {
                name: {
                    type: 'string',
                    description: "doctor's name (partial or full name)"
                },
                specialization: {
                    type: "string",
                    description: "Medical specialization (e.g., cardiology, dermatology, orthopedics, gynecology, pediatrics, etc.)"
                },
                fee: {
                    type: 'number',
                    description: 'minimum consultation fee'
                }
            },
            required: []
        },
        handler: async (args: GetDoctorsParams) => {
            try {

                // console.log(args);

                const queryParams: GetDoctorsParams = {
                    name: args.name,
                    specialization: args.specialization,
                    fee: args.fee ? Number(args.fee) : undefined,
                    lastId: args.lastId,
                    take: args.take ? Number(args.take) : undefined,
                };

                const doctors = await getDoctors(queryParams);

                return {
                    totalResult: doctors.length,
                    doctors: doctors
                };
            } catch (error) {
                console.error("Tool error:", error);
                throw new Error("Failed to fetch doctors");
            }
        }
    }
};

// # TESTING THE WORKING OF HANDLER FUNCTION CALL

// const obj = {
//     specialization: 'general',
//     take: 2

// }

// try {
//     const result = await healthTools['search_doctor']?.handler(obj);
//     console.log('RESULT:', result);
// } catch (error) {
//     console.error('ERROR in handler:', error);
// }