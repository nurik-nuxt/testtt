import { defineStore } from "pinia";
import { useApi } from "~/composable";

interface ChannelItem {
    status: string;
    token?: {
        encryptedData?: string;
        iv?: string
    };
    type: string;
    _id: string;
    connected: boolean;
    connectedBotId: string;
    title?: string
}

interface ChannelRequestItem {
    type: string;
    token?: string;
    title?: string;
}

export const useChannelStore = defineStore('channel', {

    state: () => {
        return {
            channels: [] as ChannelItem[]
        }
    },

    getters: {
        getChannels: (state) => state.channels
    },

    actions: {
        async getAllChannels() {
            try {
                const response = await useApi('/user/source', {
                    method: 'GET'
                })
                console.log(response);
                this.channels = response;
            } catch (e) {
                console.log(e)
            }
        },

        async createNewChannel(channel: ChannelRequestItem) {
            try {
                const response = await useApi('/user/source', {
                    method: 'POST',
                    body: channel
                })
                console.log(response);
                return response;
            } catch (e) {
                console.log(e)
            }
        },

        async deleteChannel(id: string) {
            try {
                const response = await useApi(`/user/source/${id}`, {
                    method: 'DELETE'
                })
                console.log(response);
                return response;
            } catch (e) {
                console.log(e)
            }
        },

        async getChannelById(id: string) {
            try {
                const response = await useApi(`/user/source/${id}`, {
                    method: 'GET'
                })
                console.log(response);
                return response;
            } catch (e) {
                console.log(e)
            }
        },

        async changeStatusChannelById(id: string, status: string) {
            try {
                const response = await useApi(`/user/source/${id}`, {
                    method: 'PATCH',
                    body: {
                        status: status
                    }
                })
                console.log(response);
                return response;
            } catch (e) {
                console.log(e);
            }
        },

        async connectChannelToBot(idChannel: string, idBot: string) {
            try {
                const response = await useApi(`/user/source/${idChannel}/connect`, {
                    method: 'POST',
                    body: {
                        botId: idBot
                    }
                })
                if (response.success) {
                    await this.getAllChannels()
                }
            } catch (e) {
                console.log(e)
            }
        },

        async disconnectChannelToBot(idChannel: string, idBot: string) {
            try {
                const response = await useApi(`/user/source/${idChannel}/disconnect`, {
                    method: 'POST',
                    body: {
                        botId: idBot
                    }
                })
                if (response.success) {
                    await this.getAllChannels()
                }
            } catch (e) {
                console.log(e)
            }
        }

    }
})