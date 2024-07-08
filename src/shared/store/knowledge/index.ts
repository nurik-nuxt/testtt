import {defineStore} from "pinia";
import {useApi} from "~/composable";

interface BaseKnowledgeItem {
    name: string;
    rus_name: string;
    content: string
}
export const useKnowledgeStore = defineStore('knowledge', {
    state:() => {
        return {
            knowledgeList: []
        }
    },

    getters: {
        getKnowledgeList: (state) => state.knowledgeList
    },
    actions: {
        async addBaseKnowledge(id: string, baseKnowledgeItem: BaseKnowledgeItem) {
            try {
                return await useApi(`/bot/${id}/file`, {
                    method: 'POST',
                    body: baseKnowledgeItem

                })
            } catch (e) {
                console.log(e)
            }
        },

        async addKnowledgeActions(botId: string, insertedId: string, actions: any) {
            try {
                const response = await useApi(`/bot/${botId}/file/${insertedId}/actions`, {
                    method: 'POST',
                    body: {
                        actions: actions
                    }
                })
                return response;
            } catch (e) {
                console.log(e)
            }
        },

        async getKnowledgeListByBot(botId: string) {
            try {
                const response = await useApi(`/bot/${botId}/file`, {
                    method: 'GET'
                })
                this.knowledgeList = response.map(item => ({
                    key: item._id,
                    data: {
                        label: item.name,
                        notification: true,
                        active: true
                    }
                }));
                return response;
            } catch (e) {
                console.log(e)
            }
        },

        async deleteKnowledgeFile(botId: string, insertedId: string) {
            try {
                const response = await useApi(`/bot/${botId}/file/${insertedId}`, {
                    method: 'DELETE'
                })
                console.log(response);
                return response;
            } catch (e) {
                console.log(e)
            }
        },

        async getKnowledgeFileById(botId: string, insertedId: string) {
            try {
                return await useApi(`/bot/${botId}/file/${insertedId}`, {
                    method: 'GET'
                });
            } catch (e) {
                console.log(e);
            }
        },

        async editKnowledgeFileById(botId: string, insertedId: string,baseKnowledgeItem: BaseKnowledgeItem){
            try {
                const response = await useApi(`/bot/${botId}/file/${insertedId}`, {
                    method: 'PATCH',
                    body: baseKnowledgeItem
                })
                console.log(response)
                return response
            } catch (e) {
                console.log(e)
            }
        }
    }
})