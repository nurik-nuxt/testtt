import {useApi} from "~/composable";

interface Analyzer {
    chosenPipeline: any;
    owner_id: string;
    prompt: string;
    provider?: string;
    status: 'on' | 'off';
    type: string;
    _id: string;
}

export const useAnalyticsStore = defineStore('analytics', {

    state: () => {
        return {
            analyzers: [] as Analyzer[]
        }
    },

    getters: {
        getAnalyzers: (state) => state.analyzers
    },

    actions: {
        async addAnalyzer(prompt: string, type: string, status: 'on' | 'off') {
            try {
                return await useApi(`/analyzer`, {
                    method: 'POST',
                    body: {
                        prompt,
                        type,
                        status
                    }
                });
            } catch (e) {
                console.error(e)
            }
        },

        async editAnalyzer(prompt: string, type: string, status: 'on' | 'off', id: string) {
            try {
                return await useApi(`/analyzer/${id}`, {
                    method: 'PATCH',
                    body: {
                        prompt,
                        type,
                        status
                    }
                });
            } catch (e) {
                console.error(e)
            }
        },


        async loadAnalyzers () {
            try {
                this.analyzers = await useApi(`/analyzer`, {
                    method: 'GET'
                });
            } catch (e) {
                console.log(e)
            }
        },

        async deleteAnalyzer(id: string) {
            try {
                return await useApi(`/analyzer/${id}`, {
                    method: 'DELETE'
                });
            } catch (e) {
                console.error(e)
            }
        }
    }
})