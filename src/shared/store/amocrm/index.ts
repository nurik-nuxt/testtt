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
            const { t } = useI18n();
            try {
                const data = await useApi(`/amocrm/crm_fields`, {
                    method: 'GET'
                });
                // Map data and add 'value' field as item.id
                this.fields = [
                    {
                        name: t('contact'),
                        code: 'contact_fields',
                        items: [
                            ...data.contact_fields.standard_fields.map(item => ({
                                ...item,
                                category: 'contact_fields',
                                type: 'standard_fields',
                            })),
                            ...data.contact_fields.custom_fields.map(item => ({
                                ...item,
                                category: 'contact_fields',
                                type: 'custom_fields',
                            }))
                        ]
                    },
                    {
                        name: t('deal'),
                        code: 'lead_fields',
                        items: [
                            ...data.lead_fields.standard_fields.map(item => ({
                                ...item,
                                category: 'lead_fields',
                                type: 'standard_fields',
                            })),
                            ...data.lead_fields.custom_fields.map(item => ({
                                ...item,
                                category: 'lead_fields',
                                type: 'custom_fields',
                            }))
                        ]
                    }
                ];
            } catch (e) {
                console.log(e);
            }
        }
    }
})