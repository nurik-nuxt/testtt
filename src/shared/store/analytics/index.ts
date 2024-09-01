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
            analyzers: [] as Analyzer[],
            responsibleUsers: [] as any
        }
    },

    getters: {
        getAnalyzers: (state) => state.analyzers,
        getResponsibleUsers: (state) => state.responsibleUsers
    },

    actions: {
        async addAnalyzer(prompt: string, type: string, status: 'on' | 'off') {
            try {
                return await useApi(`/analyzer`, {
                    method: 'POST',
                    body: {
                        prompt,
                        type,
                        status,
                        responsible_users: []
                    }
                });
            } catch (e) {
                console.error(e)
            }
        },

        async editAnalyzer(prompt: string, type: string, status: 'on' | 'off', id: string, responsible_users?: number[]) {
            try {
                return await useApi(`/analyzer/${id}`, {
                    method: 'PATCH',
                    body: {
                        prompt,
                        type,
                        status,
                        responsible_users
                    }
                });
            } catch (e) {
                console.error(e)
            }
        },


        async loadAnalyzers () {
            try {
                const response = await useApi(`/analyzer`, {
                    method: 'GET'
                });
                this.analyzers = response;
                return response
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
        },

        async getGeneralSettings() {
            try {
                return await useApi(`/analyzer/general-settings`, {
                    method: 'GET'
                });
            } catch (e) {
                console.error(e)
            }
        },

        async editGeneralSettings(model: string, apiKey: { type: string; value: string }) {
            try {
                return await useApi(`/analyzer/general-settings`, {
                    method: 'POST',
                    body: {
                        model,
                        apiKey
                    }
                });
            } catch (e) {
                console.error(e)
            }
        },

        async loadResponsibleUsers() {
            try {
                this.responsibleUsers = await useApi(`/analyzer/responsible-users`, {
                    method: 'GET'
                })
            } catch (e) {
                console.error(e)
            }
        }
    }
})