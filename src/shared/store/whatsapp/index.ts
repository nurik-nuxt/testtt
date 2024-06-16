import {defineStore} from "pinia";
import {useApi} from "~/composable";

export const useWhatsappStore = defineStore('whatsapp', {

    actions: {
        async fetchWhatsappStatus(channelId: string) {
            try {
                const response = await useApi(`/whatsapp/status/${channelId}`, {
                    method: 'GET'
                })
                return response
            } catch (e) {
                console.log(e)
            }
        },

        async fetchWhatsappQrStatus(channelId: string) {
            try {
                return await useApi(`/whatsapp/qrCode/${channelId}`, {
                    method: 'GET'
                });
            } catch (e) {
                console.log(e)
            }
        }
    }
})