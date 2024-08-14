import {useApi} from "~/composable";

interface DefaultPromt {
    systemInstruction: string;
    knowledgeBasePrompt: string;
    defaultPrompt: string;
    apiSecretKey: string
}
export const useDefaultPromtsStore = defineStore('default-promts', {
    actions: {
        async loadDefaultPromts() {
            try {
                const response = await useApi('/default-promts', {
                    method: 'GET'
                }, true)
                if (response?.success) {
                    return response?.data?.result
                }
            } catch (e) {
                console.error(e)
            }
        },

        async updateDefaultPromts(defaultPromt: DefaultPromt) {
            try {
                return await useApi('/default-promts', {
                    method: 'PUT',
                    body: defaultPromt
                }, true)
            } catch (e) {
                console.error(e)
            }
        }
    }
})