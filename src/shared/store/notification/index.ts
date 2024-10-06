import { useApi } from "~/composable";

export const useNotificationStore = defineStore('notification', {

    state: () => {
        return {
            notifications: [] as any
        }
    },

    getters: {
        getNotifications: (state) => state.notifications
    },

    actions: {
        async getTelegramNotificationLink() {
            try {
                return await useApi(`/telegram/linkTelegram`, {
                    method: 'GET'
                });
            } catch (e) {
                console.log(e)
            }
        },

        setNotification(notification: any) {
          this.notifications[0] = notification
        },

        async getNotificationList() {
            try {
                const resp = await useApi(`/notification`, {
                    method: 'GET'
                })
                if (resp?.notifications) {
                    this.notifications = resp?.notifications
                }
            } catch (e) {
                console.error(e)
            }
        }
    }
})