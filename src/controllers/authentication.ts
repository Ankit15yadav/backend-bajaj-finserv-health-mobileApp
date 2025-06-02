import type { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { generateOTP, sendOTP } from "../../utils/otp";
import { generateAuthToken, generateRefreshToken } from "../../utils/token-generation";
import bcrypt from "bcryptjs"

export async function UserLogin(req: Request, res: Response) {
    const { phoneNumber } = req.body;

    // Input validation
    if (!phoneNumber) {
        return res.status(400).json({
            success: false,
            message: "Phone number is a required field"
        });
    }

    if (phoneNumber.length < 10) {
        return res.status(400).json({
            success: false,
            message: "Phone number length should be 10"
        });
    }

    try {
        // Generate OTP and expiration time upfront
        const otp = generateOTP()
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const hashedOTP = bcrypt.hashSync(otp, 3)
        // Parallel execution of database operations

        // this is destructing of user , if i want other field of promise 
        // then i can use [user, otpResult, ...]
        const [user] = await Promise.all([
            // Find or create user   
            prisma.user.upsert({
                where: { phoneNumber },
                update: {}, // No updates needed if user exists
                create: {
                    phoneNumber,
                    firstName: '',
                    lastName: '',
                    isFirstTimeLogin: true
                }
            }),

            // Store OTP in parallel
            prisma.otp.upsert({
                where: { phoneNumber },
                update: {
                    otp: hashedOTP,
                    otpExpires: expiresAt
                },
                create: {
                    phoneNumber,
                    otp: hashedOTP,
                    otpExpires: expiresAt
                }
            })
        ]);

        // Generate tokens
        const payload = {
            id: user.id,
            name: user.firstName
        };
        const authToken = generateAuthToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Send response immediately (don't wait for OTP to be sent)
        res.status(200).json({
            success: true,
            authToken,
            refreshToken,
            hashedOTP: hashedOTP,
            firstTimeLogin: user.isFirstTimeLogin,
            message: "OTP is being sent to your phone"
        });

        // Send OTP asynchronously (fire and forget)
        sendOTP(phoneNumber, otp).catch(error => {
            console.error('Failed to send OTP:', error);
            // You might want to implement retry logic or notification here
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function ResendOtp(req: Request, res: Response) {

    const { phoneNumber } = req.body

    if (!phoneNumber) {
        throw new Error("Phone number is required");
    }

    const otp = generateOTP();
    const hashedOTP = bcrypt.hashSync(otp, 3);

    await prisma.otp.upsert({
        where: { phoneNumber },
        update: {
            otp: hashedOTP,
        },
        create: {
            phoneNumber,
            otp: hashedOTP,
        }
    })

    res.status(200).json({
        success: true,
        hashedOTP,
    })

    sendOTP(phoneNumber, otp)
}