import {useApi} from "~/composable";

export const useTelegramBotToken = defineStore('telegram-bot-token', {
    actions: {
        async loadTelegraBotToken() {
            try {
                const response = await useApi(`/get-bot-token`, {
                    method: 'GET'
                },true)
                if (response?.success) {
                    return response?.data
                }
            } catch (e) {
                console.error(e);
            }
        },

        async addTelegramBotToken(botBody: { username: string;  token: string; }) {
            try {
                return await useApi(`/add-bot-token`, {
                    method: 'POST',
                    body: botBody
                }, true);
            } catch (e) {
                console.error(e)
            }
        }
    }
})