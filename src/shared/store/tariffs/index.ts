import { useApi } from "~/composable";

export const useTariffsStore = defineStore('tariffs', {

    actions: {
        async loadTariffs() {
            try {
                const tariffs = await useApi(`/tariffs`, {
                    method: 'GET'
                })
            } catch (e) {
                console.error(e)
            }
        }
    }
})