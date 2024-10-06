import { io } from "socket.io-client";
import jsCookie from "js-cookie";
import { useChatStore } from "~/src/shared/store/chat";
const { apiBaseUrl} = useRuntimeConfig().public;

interface Message {
    id: number;
    sender: string;
    message: string;
}
export const state = reactive({
    connected: false,
    messages: [] as Message[]
})

export const socket = io(`${apiBaseUrl}/superchat`, {
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

socket.on('message', async (message) => {
    const chatStore = useChatStore();
    if (message?.lead?._id) {
        chatStore.changeLeads(message?.lead?._id, message?.role, message?.type, message?.message?.text, message?.message?.created_at)
    }
})