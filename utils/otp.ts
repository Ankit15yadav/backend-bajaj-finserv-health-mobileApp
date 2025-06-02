import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NO!;
const client = twilio(accountSid, authToken)

export const sendOTP = async (to: string, otp: string) => {

    try {

        const message = await client.messages.create({
            body: `Your otp is ${otp}`,
            from: twilioPhone,
            to: `+91${to}`
        })

        console.log('message sent')
        return message

    } catch (error) {
        console.log(error)
    }
}

export const generateOTP = () => {

    return Math.floor(100000 + Math.random() * 900000).toString();
}