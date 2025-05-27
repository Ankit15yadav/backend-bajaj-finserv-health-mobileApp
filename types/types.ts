export interface JwtPayload {
    id: string,
    firstName: string,
    lastName: string
}

export interface LoginRequestBody {
    phoneNumber: string,
    password: string,
}

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    isFirstTimeLogin: boolean,
    phoneNumber: string

}