import {defineStore} from "pinia";
import {useApi} from "~/composable";

type ChannelCredentials = {
    client_id?: string;
    client_secret?: string
}
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
    credentials?: ChannelCredentials;
    webhook?: string;
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
                this.channels = await useApi('/user/source', {
                    method: 'GET'
                });
            } catch (e) {
                console.log(e)
            }
        },

        async createNewChannel(channel: ChannelRequestItem) {
            try {
                return await useApi('/user/source', {
                    method: 'POST',
                    body: channel
                });
            } catch (e) {
                console.log(e)
            }
        },

        async deleteChannel(id: string) {
            try {
                return await useApi(`/user/source/${id}`, {
                    method: 'DELETE'
                });
            } catch (e) {
                console.log(e)
            }
        },

        async getChannelById(id: string) {
            try {
                return await useApi(`/user/source/${id}`, {
                    method: 'GET'
                });
            } catch (e) {
                console.log(e)
            }
        },

        async changeStatusChannelById(id: string, status?: string, title?: string, token?: string) {
            try {
                return await useApi(`/user/source/${id}`, {
                    method: 'PATCH',
                    body: {
                        status: status,
                        title: title,
                        token: token
                    }
                });
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