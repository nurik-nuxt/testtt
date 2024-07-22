import { io } from "socket.io-client";
import jsCookie from "js-cookie";
import { useChatStore } from "~/src/shared/store/chat";

interface Message {
    id: number;
    sender: string;
    message: string;
}
export const state = reactive({
    connected: false,
    messages: [] as Message[]
})

export const socket = io('https://api.7sales.ai/superchat', {
    auth: {
        token: jsCookie.get('accessToken')
    }
});

socket.on("connect", () => {
    state.connected = true;
});

socket.on("disconnect", () => {
    console.log('disconnect')
    state.connected = false;
    state.messages = [];
});

socket.on('message', (message) => {
    console.log(message);
    const chatStore = useChatStore();
    if (message?.lead?._id) {
        chatStore.changeLeads(message?.lead?._id, message?.role, message?.type, message?.message?.text, message?.message?.created_at)
    }
})