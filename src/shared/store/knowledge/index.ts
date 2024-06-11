import { defineStore } from "pinia";
import { useApi } from "~/composable";

interface BaseKnowledgeItem {
    name: string;
    rus_name: string;
    content: string
}
export const useKnowledgeStore = defineStore('knowledge', {
    actions: {
        async addBaseKnowledge(id: string, baseKnowledgeItem: BaseKnowledgeItem) {
            try {
                const response = await useApi(`/bot/${id}/file`, {
                    method: 'POST',
                    body: baseKnowledgeItem

                })
                console.log(response);
            } catch (e) {
                console.log(e)
            }
        }
    }
})