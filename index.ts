import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import twilio from "twilio"


const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NO!;

const client = twilio(accountSid, authToken)


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

const sendOTP = async (to: string, otp: string) => {

    try {

        const message = await client.messages.create({
            body: `Your otp is ${otp}`,
            from: twilioPhone,
            to: to
        })

        console.log('message sent')
        return message

    } catch (error) {
        console.log(error)
    }
}

app.get("/get", async (req: Request, res: Response) => {

    const response = await sendOTP('+919166304793', "123533")

    res.send({
        message: response,
        status: 200
    })
})

app.listen(PORT, () => {
    console.log(`Server is running of port : ${PORT}`)
})