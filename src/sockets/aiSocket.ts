import { Server as SocketIOServer, Socket } from 'socket.io';
import { genAIService } from '../services/genAiServices';
import type { Message } from '../../types/types';

class SocketIoSetup {

    public async setupAISocket(io: SocketIOServer) {
        console.log("Waiting for the socket connection from the user")

        io.on("connection", (socket: Socket) => {
            console.log('client connected', socket.id)

            socket.on("generate-stream", async (data: { prompt: string, history?: Message[] }) => {
                try {

                    const { prompt, history } = data;

                    if (!prompt) {
                        socket.emit("error", { message: "Prompt is required" });
                        return;
                    }

                    socket.emit('generation-start')

                    for await (const chunk of genAIService.generateContentStream(prompt, history)) {
                        socket.emit('chunk', { text: chunk })
                    }

                    socket.emit("generation-complete");

                } catch (error) {
                    console.log("Socket AI error", error)
                    socket.emit('error', {
                        message: 'failed to generate content'
                    })
                }
            })

            socket.on('disconnect', () => {
                console.log('client disconnected', socket.id)
            })
        })
    }
}

export const socketIOSetup = new SocketIoSetup();