import { io } from "socket.io-client";
import jsCookie from "js-cookie";

interface Message {
    id: number;
    sender: string;
    message: string;
}
export const state = reactive({
    connected: false,
    messages: [] as Message[]
})
export const socket = io('https://api.7sales.ai/chat', {
    auth: {
        token: jsCookie.get('accessToken')
    }
});

socket.on("connect", () => {
    state.connected = true;
});

socket.on("disconnect", () => {
    state.connected = false;
    state.messages = [];
});

socket.on('message', (message) => {
    state.messages.unshift({
        id: state.messages.length + 1,
        sender: 'Bot',
        message: message
    })
})