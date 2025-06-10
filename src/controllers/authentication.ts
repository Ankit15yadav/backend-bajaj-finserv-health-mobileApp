import type { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { generateOTP, sendOTP } from "../../utils/otp";
import { generateAuthToken, generateRefreshToken } from "../../utils/token-generation";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function UserLogin(req: Request, res: Response): Promise<Response | undefined> {
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
                    isFirstTimeLogin: true,
                    age: '', bloodGroup: '',
                    gender: 'null',
                    height: '',
                    weight: '',
                    refreshToken: ''
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
            phone: user.phoneNumber
        };
        const authToken = generateAuthToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await prisma.user.update({
            where: {
                id: user?.id,
            },
            data: {
                refreshToken
            }
        })

        sendOTP(phoneNumber, otp).catch(error => {
            console.error('Failed to send OTP:', error);
            // You might want to implement retry logic or notification here
        });

        // Send response immediately (don't wait for OTP to be sent)
        return res.status(200).json({
            success: true,
            authToken,
            hashedOTP: hashedOTP,
            firstTimeLogin: user.isFirstTimeLogin,
            message: "OTP is being sent to your phone"
        });


    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function ResendOtp(req: Request, res: Response): Promise<Response | undefined> {

    // console.log(req);
    try {
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
        sendOTP(phoneNumber, otp)

        return res.status(200).json({
            success: true,
            hashedOTP,
        })
    } catch (error) {
        console.log(error)
    }
}

export async function RefreshToken(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const { phoneNumber } = req.body;

        const userId = phoneNumber;
        // find user by id
        const user = await prisma.user.findUnique({
            where: {
                phoneNumber: userId,
            }
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "USER IS NOT PRESENT"
            })
        }
        // get refresh token from user and  validate it
        const refreshToken = user.refreshToken;
        const verifyToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET! ?? "")
        if (!verifyToken) {
            // token is not valid return the response that user should logged in
            return res.status(401).json({
                success: false,
                message: "REFRESH TOKEN IS NOT VALID , PLEASE LOG IN THE USER AGAIN"
            })
        }

        console.log("REFRESH TOKEN IS VALID")
        // if valid create new access and refresh token
        const payload = {
            id: user.id,
            phone: user.phoneNumber
        };
        const newAccessToken = generateAuthToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        await prisma.user.update({
            where: {
                phoneNumber: userId
            },
            data: {
                refreshToken: newRefreshToken
            }
        })

        console.log("NEW TOKEN INSERTED IN THE DB")

        return res.status(200).json({
            success: true,
            message: "TOKEN GENERATED SUCCESSFULLY",
            newAccessToken,
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            success: false,
            message: "ERROR WHILE REFRESHING TOKEN"
        })
    }
}