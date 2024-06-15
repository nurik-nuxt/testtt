import { io } from "socket.io-client";
import jsCookie from "js-cookie";

export const state = reactive({
    connected: false,
    fooEvents: [],
    barEvents: []
})
export const socket = io('ws://api.7sales.ai/chat', {
    auth: {
        token: jsCookie.get('accessToken')
    }
});

socket.on("connect", () => {
    state.connected = true;
});

socket.on("disconnect", () => {
    state.connected = false;
});

socket.on("foo", (...args) => {
    state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
    state.barEvents.push(args);
});