import { useApi } from "~/composable";
import { defineStore } from "pinia";
import {use} from "h3";

interface ActiveStatusItem {
    pipeline_id: number;
    active_statuses: number[];
}

export const useAmoCrmStore = defineStore('amocrm', {

    state: () => {
        return {
            activeFunnels: [] as any,
            funnels: [] as any
        }
    },

    getters: {
        getActiveFunnels: (state) => state.activeFunnels,
        getAllFunnels: (state) => state.funnels
    },
    actions: {
        async fetchVoronki() {
            try {
                const response = await useApi('/amocrm/voronkas', {
                    method: 'GET'
                })
                console.log(response);
                this.funnels = response
                return response;
            } catch (e) {
                console.log(e)
            }
        },

        async fetchActiveFunnels(idChannel: string){
            try {
                const response = await useApi(`/amocrm/active-pipelines/${idChannel}`,{
                    method: 'GET'
                })
                console.log(response);
                this.activeFunnels = response;
            } catch (e) {
                console.log(e);
            }
        },

        async changeActiveStatus(activeStatusItems: ActiveStatusItem[], idChannel: string){
            try {
                const response = await useApi(`/amocrm/active-pipelines/${idChannel}`, {
                    method: 'POST',
                    body: activeStatusItems
                })
                console.log(response)
                return response;
            } catch (e) {
                console.log(e)
            }
        }
    }
})