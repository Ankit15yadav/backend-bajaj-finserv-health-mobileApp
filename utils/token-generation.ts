import jwt, { type JwtPayload } from "jsonwebtoken"

export function generateAuthToken(payload: JwtPayload) {

    return jwt.sign(
        payload,
        process.env.AUTH_TOKEN_SECRET! as string,
        {
            expiresIn: '20s'
        });
}

export function generateRefreshToken(payload: JwtPayload) {
    return jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET! as string,
        {
            expiresIn: '40s'
        });
}