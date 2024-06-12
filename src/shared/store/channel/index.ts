import { defineStore } from "pinia";
import { useApi } from "~/composable";

interface ChannelItem {
    status: string;
    token: {
        encryptedData: string;
        iv: string
    };
    type: string;
    _id: string;
}

interface ChannelRequestItem {
    type: string;
    token?: string;
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
        }
    }
})