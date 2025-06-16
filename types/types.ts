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
    isFirstTimeLogin?: boolean | null,
    phoneNumber: string

}

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    isStreaming?: boolean;
}