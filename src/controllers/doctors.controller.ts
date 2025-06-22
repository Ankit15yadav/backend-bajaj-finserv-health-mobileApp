// controllers/doctor.controller.ts

import type { Request, Response } from "express";
import { getDoctors } from "../services/doctor.service";

export async function getDoctorInformation(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const doctors = await getDoctors({
            name: req.query.name as string,
            specialization: req.query.specialization as string,
            lastId: req.query.lastId as string,
            take: req.query.take ? Number(req.query.take) : undefined,
            fee: req.query.fee ? Number(req.query.fee) : undefined,
        });

        // if (!doctors || doctors.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: `NO DOCTORS FOUND`,
        //     });
        // }

        return res.status(200).json({
            success: true,
            data: doctors,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
        });
    }
}
