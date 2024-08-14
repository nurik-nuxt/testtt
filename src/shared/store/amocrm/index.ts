import {useApi} from "~/composable";
import {defineStore} from "pinia";

interface ActiveStatusItem {
    pipeline_id: number;
    active_statuses: number[];
}

export const useAmoCrmStore = defineStore('amocrm', {

    state: () => {
        return {
            activeFunnels: [] as any,
            funnels: [] as any,
            fields: [] as any
        }
    },

    getters: {
        getActiveFunnels: (state) => state.activeFunnels,
        getAllFunnels: (state) => state.funnels,
        getFields: (state) => state.fields
    },
    actions: {
        async fetchVoronki() {
            try {
                const response = await useApi('/amocrm/voronkas', {
                    method: 'GET'
                })
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
                if (response) {
                    this.activeFunnels = response;
                } else {
                    this.activeFunnels = []
                }
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
        },

        async fetchAmoCrmFields() {
            try {
                this.fields = await useApi(`/amocrm/fields`, {
                    method: 'GET'
                });
            } catch (e) {
                console.log(e)
            }
        }
    }
})