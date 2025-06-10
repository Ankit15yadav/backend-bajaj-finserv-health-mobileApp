import type { Request, Response } from "express";
import prisma from "../../utils/prisma";


export async function AddUserDetails(req: Request, res: Response): Promise<Response | undefined> {

    try {
        console.log('route called ')
        console.log(req.body?.formData)
        const userId = req?.user?.id;
        const { firstName, lastName, gender } = req.body.formData

        if (!firstName || !lastName || !gender) {
            return res.status(404).json({
                success: false,
                message: `ALL FIELDS OF THE USER ARE REQUIRED , firstname: ${firstName} , lastname: ${lastName} , gender: ${gender}`
            })
        }

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                firstName,
                lastName,
                gender,
                isFirstTimeLogin: false
            }
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: `USER NOT FOUND WITH ID: ${userId}`
            })
        }

        return res.status(200).json({
            success: true,
            message: "User Details added successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR"
        })
    }
}