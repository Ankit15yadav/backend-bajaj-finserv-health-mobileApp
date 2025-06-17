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

export interface Tools {
    name: string,
    description: string,
    parameter: {
        type: string,
        properties: Record<string, any>
        required: string[]
    }
    handler: (args: GetDoctorsParams) => Promise<any>
}


export interface GetDoctorsParams {
    name?: string;
    specialization?: string;
    lastId?: string;
    take?: number;
    fee?: number;
}

export interface Doctor {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    dob: Date;
    profileImage?: string | null;
    specialization: string;
    experienceYears: number;
    education: string;
    languagesSpoken: string[];
    consultationFee: number;
    isVerified: boolean;
    rating: number;
    bio?: string | null;
    address?: string | null;
    city: string;
    state: string;
    pincode: string;
    createdAt: Date;
    updatedAt: Date;
}