import {useApi} from "~/composable";

export const useNotificationStore = defineStore('notification', {

    actions: {
        async getTelegramNotificationLink() {
            try {
                return await useApi(`/telegram/linkTelegram`, {
                    method: 'GET'
                });
            } catch (e) {
                console.log(e)
            }
        }
    }
})