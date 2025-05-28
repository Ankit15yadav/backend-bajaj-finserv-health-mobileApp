import type { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { sendOTP } from "../../utils/send-otp";
import { generateAuthToken, generateRefreshToken } from "../../utils/token-generation";

export async function Login(req: Request, res: Response) {

    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        throw new Error("Phone number is a required field");
    }

    if (phoneNumber.length < 10) {
        throw new Error("Phone number length should be 10")
    }

    // check if user is prensent or not
    let user = await prisma.user.findUnique({
        where: {
            phoneNumber: phoneNumber
        }
    })

    if (!user) {
        // insert user in the db
        user = await prisma.user.create({
            data: {
                phoneNumber: phoneNumber,
                firstName: '',
                lastName: '',
                isFirstTimeLogin: true
            }
        })

    }

    // random otp generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // otp expiration time 
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // insert the otp in the database
    await prisma.otp.upsert({
        where: {
            phoneNumber: phoneNumber,
        },
        update: {
            otp: otp,
            otpExpires: expiresAt
        },
        create: {
            phoneNumber: phoneNumber,
            otp: otp,
            otpExpires: expiresAt
        }
    })


    // send otp through SMS
    await sendOTP(phoneNumber, otp)

    // generate tokens 
    const payload = {
        id: user.id,
        name: user.firstName
    }
    const authToken = generateAuthToken(payload)
    const refreshToken = generateRefreshToken(payload);

    res.status(200).json({
        success: true,
        authToken,
        refreshToken,
        otp
    })
}