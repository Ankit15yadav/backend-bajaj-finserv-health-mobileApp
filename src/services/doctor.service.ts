// services/doctor.service.ts

import type { GetDoctorsParams } from "../../types/types";
import prisma from "../../utils/prisma";


export async function getDoctors(params: GetDoctorsParams) {
    const { name, specialization, lastId, take = 4, fee } = params;

    try {
        // console.log('calling api')

        const doctors = await prisma.doctor.findMany({
            where: {
                AND: [
                    name ? { fullName: { contains: name, mode: "insensitive" } } : {},
                    specialization ? { specialization: { contains: specialization, mode: "insensitive" } } : {},
                    fee ? { consultationFee: { lte: fee } } : {},
                ],
            },

            ...(lastId && {
                cursor: { id: lastId },
                skip: 1,
            }),

            take,
            orderBy: {
                fullName: 'asc'
            },
        });
        // console.log("api called")

        return doctors;
    } catch (error) {
        throw new Error("Failed to fetch doctors");
    }
}
