import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import auth from "./src/routes/auth"
import user from "./src/routes/user"


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


app.use('/api/auth', auth)
app.use('/api', user)

app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})