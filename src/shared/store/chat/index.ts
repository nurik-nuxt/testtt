import {defineStore} from "pinia";
import {useApi} from "~/composable";

export const useChatStore = defineStore('chat', {
    state: () => {
        return {
            leads: [],
            isLoadingChat: false
        }
    },

    getters: {
        allLeads: (state) => state.leads,
        getLoadingChat: (state) => state.isLoadingChat
    },

    actions: {
        async getLeads() {
            try {
                const response = await useApi('/chat/leads_with_last', {
                    method: 'GET'
                })
                this.leads = response;
                return response;
            } catch (e) {
                console.log(e)
            }
        },

        async getLeadById(id: string | number) {
            try {
                return await useApi(`/chat/leads/${id}`, {
                    method: 'GET'
                }, false);
            } catch (e) {
                console.error(e)
            }
        },
        async deleteAllMessageLead(id: string | number) {
            this.isLoadingChat = true;
            try {
                const response = await useApi(`/chat/leads/${id}/messages`, {
                    method: 'DELETE'
                }, false)
                this.isLoadingChat = false
                return response;
            } catch (e) {
                this.isLoadingChat = false
                console.error(e)
            }
        },
        async deleteLead(id: string | number) {
            this.isLoadingChat = true;
            try {
                const response = await useApi(`/chat/leads/${id}`, {
                    method: 'DELETE'
                }, false)
                this.isLoadingChat = false
                return response;
            } catch (e) {
                this.isLoadingChat = false
                console.error(e)
            }
        },
        async getLeadMessagesById(id: string | number) {
            this.isLoadingChat = true;
            try {
                const response = await useApi(`/chat/leads/${id}/messages`, {
                    method: 'GET'
                }, false)
                this.isLoadingChat = false
                return response;
            } catch (e) {
                this.isLoadingChat = false
                console.error(e)
            }
        }
    }
})