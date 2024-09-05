// Define the interfaces for the lead objects
interface Message {
    _id: string;
    message: {
        author_id: number;
        chat_id: number | string;
        name?: string;
        username?: string;
        text: string;
        created_at: number;
    };
    leadId: string;
    owner_id: string;
    type: string;
    channel: string;
    createdAt: number;
    role: string;
    deleteStart: string | null;
    unreadMessageCount?: number | null;
}

interface Lead {
    _id: string;
    author_id?: number;
    chat_id?: number | string;
    name?: string;
    username?: string;
    text?: string;
    bot_stopped?: boolean;
    created_at: number;
    owner_id: string;
    channel: string;
    source_id?: string | null;
    deleteStart: string | null;
    thread_id: string;
    messages: Message;
    lastMessage: Message;
}

// Import necessary modules and interfaces
import { defineStore } from 'pinia';
import { useApi } from '~/composable';

export const useChatStore = defineStore('chat', {
    state: () => {
        return {
            leads: [] as Lead[],
            isLoadingChat: false
        };
    },

    getters: {
        allLeads: (state) => state.leads,
        getLoadingChat: (state) => state.isLoadingChat,
    },

    actions: {
        changeLeads(id: string, role: string, type: string, messageText: string, created_at:number) {
            const index = this.leads.findIndex((lead) => lead._id === id);
            if (index !== -1) {
                const [lead] = this.leads.splice(index, 1);

                if (lead.lastMessage) {
                    lead.lastMessage.role = role;
                    lead.lastMessage.type = type;
                    lead.lastMessage.message.text = messageText
                    lead.lastMessage.message.created_at = created_at
                    lead.messages.unreadMessageCount += 1;
                }

                this.leads.unshift(lead);
            }
        },

        setUnreadMessageCountToZero(id: string) {
            const lead = this.leads.find((lead) => lead._id === id);
            if (lead) {
                lead.messages.unreadMessageCount = 0;
            }
        },

        async getLeads() {
            try {
                const response = await useApi('/chat/leads_with_last', {
                    method: 'GET',
                });
                console.log(response);
                this.leads = (response?.data as Lead[]).map(lead => {
                    if (lead.messages && (lead.messages.unreadMessageCount === undefined || lead.messages.unreadMessageCount === null)) {
                        lead.messages.unreadMessageCount = 0;
                    }
                    return lead;
                });
                return response;
            } catch (e) {
                console.log(e);
            }
        },

        async getLeadById(id: string | number) {
            try {
                return await useApi(`/chat/leads/${id}`, {
                    method: 'GET',
                }, false) as Lead;
            } catch (e) {
                console.error(e);
            }
        },

        async deleteAllMessageLead(id: string | number) {
            this.isLoadingChat = true;
            try {
                const response = await useApi(`/chat/leads/${id}/messages`, {
                    method: 'DELETE',
                }, false);
                this.isLoadingChat = false;
                return response;
            } catch (e) {
                this.isLoadingChat = false;
                console.error(e);
            }
        },

        async deleteLead(id: string | number) {
            this.isLoadingChat = true;
            try {
                const response = await useApi(`/chat/leads/${id}`, {
                    method: 'DELETE',
                }, false);
                this.isLoadingChat = false;
                return response;
            } catch (e) {
                this.isLoadingChat = false;
                console.error(e);
            }
        },

        async getLeadMessagesById(id: string | number) {
            this.isLoadingChat = true;
            try {
                const response = await useApi(`/chat/leads/${id}/messages`, {
                    method: 'GET',
                }, false,false);
                this.isLoadingChat = false;
                return response;
            } catch (e) {
                this.isLoadingChat = false;
                console.error(e);
            }
        },

        async startBot(id: string) {
            try {
                const response = await useApi(`/chat/leads/${id}/start`, {
                    method: 'GET'
                })
                if (response?.success) {
                    await this.getLeads()
                }
            } catch (e) {
                console.error(e)
            }
        },

        async stopBot(id: string) {
            try {
                const response = await useApi(`/chat/leads/${id}/stop`, {
                    method: 'GET'
                })
                if (response?.success) {
                    await this.getLeads()
                }
            } catch (e) {
                console.error(e)
            }
        },
    },
});
