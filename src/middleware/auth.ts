import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
    try {

        // get token from the headers
        const token = req.headers['authorization']?.replace('Bearer ', '');

        // if token is not presnet then respond with 401 error  
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is not present / unAuthorized"
            })
        }

        // verify the token
        const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN_SECRET!);
        // console.log("Decoded token", decodedToken)
        req.user = decodedToken;

        next()
    } catch (error) {
        console.log(error);

        return res.status(401).json({
            success: false,
            message: "TOKEN IS EXPIRED , REFRESH THE TOKEN OF THE USER"
        })
    }
}