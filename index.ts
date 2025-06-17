import express, { type RequestHandler } from "express"
import dotenv from "dotenv"
import cors from "cors"
import auth from "./src/routes/auth"
import user from "./src/routes/user"
import doctor from "./src/routes/doctors"
import http from "http"
import { Server as SocketIoServer } from "socket.io"
import { socketIOSetup } from "./src/sockets/aiSocket"


dotenv.config()

const app = express()
const server = http.createServer(app);
const PORT = process.env.PORT || 5000

const io = new SocketIoServer(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    },
    transports: ['websocket']
})

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
app.use('/api/information', doctor)

socketIOSetup.setupAISocket(io);

server.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})