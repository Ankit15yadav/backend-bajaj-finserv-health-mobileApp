import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import { sendOTP } from "./utils/send-otp"
import prisma from "./utils/prisma"
import type { LoginRequestBody, User } from "./types/types"
import type { JwtPayload } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import auth from "./src/routes/auth"


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// cors setup
app.use(cors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: ['*']
}))

// this is middleware
app.use(express.json())



app.get("/get", async (req: Request, res: Response) => {

    const response = await sendOTP('+919166304793', "123533")

    res.send({
        message: response,
        status: 200
    })
})


/*
the three sets of curly braces represent the generic type parameters for Express's Request type:

Request<Params = {}, ResBody = any, ReqBody = any, ReqQuery = ParsedQs, Locals = Record<string, any>>
*/
// app.post("/login", async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {

//     const { phoneNumber } = req.body

//     if (!phoneNumber) {
//         throw new Error("PhoneNumber is missing!!")
//     }

//     // find if user exist or not
//     const user: User | null = await prisma.user.findUnique({
//         where: {
//             phoneNumber
//         }
//     })

//     if (!user) {

//         throw new Error("User is not Registered")
//     }

//     // if user is presnet genrate token for that user   

//     // payload
//     const payload: JwtPayload = {
//         id: user.id,
//         phoneNumber: user.phoneNumber
//     }

//     // secret for jwt
//     const secret = process.env.AUTH_TOKEN_SECRET!

//     // options

//     const options: jwt.SignOptions = {
//         expiresIn: '1d',
//         // here hs256 can't be a string that's why this is passed a s    
//         algorithm: 'HS256',
//     }

//     const token = jwt.sign(payload, secret, options);

//     const respone = {
//         AuthToken: token,
//         message: "User Logged in successfully"
//     }

//     res.status(201).json(respone)

// })

app.use('/api/auth', auth)

app.listen(PORT, () => {
    console.log(`Server is running of port : ${PORT}`)
})