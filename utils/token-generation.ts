import jwt, { type JwtPayload } from "jsonwebtoken"

export function generateAuthToken(payload: JwtPayload) {

    return jwt.sign(
        payload,
        process.env.AUTH_TOKEN_SECRET! as string,
        {
            expiresIn: '1h'
        });
}

export function generateRefreshToken(payload: JwtPayload) {
    return jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET! as string,
        {
            expiresIn: '10d'
        });
}