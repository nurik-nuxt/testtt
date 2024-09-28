import {useApi} from "~/composable";
import {defineStore} from "pinia";

interface Funnel {
    ID: string;
    CREATED_DATE: string;
    NAME: string;
    SORT: string;
    IS_LOCKED: string;
    statuses?: FunnelStatus[]
}

interface FunnelStatus {
    STATUS_ID: string;
    NAME: string;
    SORT: number;
}

interface Filed {
    "key": string;
    "type": string;
    "isRequired": boolean;
    "isReadOnly": boolean;
    "isImmutable": boolean;
    "isMultiple": boolean;
    "isDynamic": boolean;
    "name": string;
}
interface ActiveStatusItem {
    pipeline_id: number;
    active_statuses: number[];
}

export const useBitrix24 = defineStore('bitrix24', {
    state: () => {
        return {
          funnels: [] as Funnel[],
          statuses: [] as FunnelStatus[],
          activeFunnels: [] as any,
          fields: [] as Filed[]
        }
    },

    getters: {
        getFunnels: (state) => state.funnels,
        getStatuses: (state) => state.statuses,
        getActiveFunnels: (state) => state.activeFunnels,
        getFields: (state) => state.fields
    },

    actions: {
        async loadFunnels(id: string) {
            try {
                this.funnels = await useApi(`/bitrix24/funnels/${id}`, {
                    method: 'GET'
                });
            } catch (e) {
                console.error(e)
            }
        },

        async loadFields() {
            try {
                const response = await useApi(`/bitrix24/fields`, {
                    method: 'GET'
                });
                if (response?.fields) {
                    this.fields = response?.fields
                }
            } catch (e) {
                console.error(e)
            }
        },

        async loadStatuses(id: string) {
            try {
                const response = await useApi(`/bitrix24/funnels/${id}/statuses`, {
                    method: 'GET'
                })
                console.log(response);
                return response;
            } catch (e) {
                console.error(e)
            }
        },

        async fetchActiveFunnels(idChannel: string){
            try {
                const response = await useApi(`/bitrix24/active-pipelines/${idChannel}`,{
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
                const response = await useApi(`/bitrix24/active-pipelines/${idChannel}`, {
                    method: 'POST',
                    body: activeStatusItems
                })
                console.log(response)
                return response;
            } catch (e) {
                console.log(e)
            }
        },
    }
})