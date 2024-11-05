import { io } from "socket.io-client";
import jsCookie from "js-cookie";
import {state} from "~/super-chat";
import { useSubscriptionStore } from "~/src/shared/store/subscription";
import { useNotificationStore } from "~/src/shared/store/notification";

const { apiBaseUrl} = useRuntimeConfig().public;

export const socket = io(`${apiBaseUrl}/notification`, {
    auth: {
        token: jsCookie.get('accessToken')
    }
});

socket.on("connect", () => {
    state.connected = true;
    // console.log('notification socket connected');
});

socket.on("disconnect", () => {
    state.connected = false;
    state.messages = [];
});

socket.on('read', async (message) => {
    console.log('read')
    console.log(message);
})
socket.on('notification', async (notification) => {
    const notificationStore = useNotificationStore();
    if (notification?._id) {
        notificationStore.setNotification(notification)
    }
})
socket.on('usage', async (message) => {
    console.log(message)
    const subscriptionStore = useSubscriptionStore()
    if (message?.usage) {
        subscriptionStore.setSubscriptionUsage(message?.usage)
    }
})
