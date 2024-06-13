import { useApi } from "~/composable";
import { defineStore } from "pinia";

export const useAmoCrmStore = defineStore('amocrm', {

    actions: {
        async fetchVoronki() {
            try {
                const response = await useApi('/amocrm/voronkas', {
                    method: 'GET'
                })
                console.log(response);
                return response;
            } catch (e) {
                console.log(e)
            }
        }
    }
})