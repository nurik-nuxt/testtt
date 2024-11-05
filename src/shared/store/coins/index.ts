import { defineStore } from "pinia";
import { useApi } from "~/composable";

export const useCoins = defineStore('coins', {

    actions: {
        async getAllCoinTariff() {
            try {
                const response = await useApi(`/coins`, {
                    method: 'GET'
                },true)
                console.log(response);
            } catch (e) {
                console.log(e)
            }
        }
    }
})