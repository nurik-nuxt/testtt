import { defineStore } from "pinia";
import { useApi } from "~/composable";


interface Bot {
    _id: string;
    user_id: string;
    instructions: string;
    apiKey?: {
        iv: string;
        encryptedData: string
    };
    channels?: [string];
    controlSignals?: {
        stopBot: any;
        continueBot: any;
    };
    description?: string;
    gpt_assistant_id?: string;
    hello_on_first?: boolean;
    isLimit?: boolean;
    isSchedule?: boolean;
    joinTimeout?: number;
    maxTokens?: number;
    messageLimit?: {
        qty: number;
        period: number;
        granularity: string;
    };
    model?: string;
    name?: string;
    operatorStopTime?: string;
    schedule?: {
        start: string;
        end: string;
        offset: number;
    };
    smallTimeout?: number;
    stopOnOperator?: boolean;
    temperature?: number;
    whisper?: boolean;
}

export const useBotStore = defineStore('bot', {
    state: () => {
        return {
            bots: [] as Bot[],
            currentBot: {} as Bot
        }
    },

    getters: {
        getBots: (state) => state.bots,
        getCurrentBot: (state) => state.currentBot
    },
    actions: {
        async createBot() {
            try {
                return useApi('/bot', {
                    method: 'POST'
                });
            } catch (e) {
                console.log(e)
            }
        },

        async getBotList() {
            try {
                const response = await useApi('/bot', {
                    method: 'GET'
                })
                this.bots = response;
                return response
            } catch (e) {
                console.log(e)
            }
        },

        async getBot(id: string) {
            try {
                const response = await useApi(`/bot/${id}`, {
                    method: 'GET'
                })
                this.currentBot = response
                return response;
            } catch (e) {
                console.log(e)
            }
        },

        async editBot(id: string, botItem: Bot) {
            try {
                return await useApi(`/bot/${id}`, {
                    method: 'PATCH',
                    body: botItem
                })
            } catch (e) {
                console.log(e)
            }
        },

        async deleteBot(id: string){
            try {
                return await useApi(`/bot/${id}`, {
                    method: 'DELETE'
                });
            } catch (e) {
                console.log(e)
            }
        },

        async saveFunctionById(id: string, botFunctions: any) {
            try {
                const response = await useApi(`/bot/${id}/functions_batch`, {
                    method: 'POST',
                    body: botFunctions
                })
                console.log(response);
            } catch (e) {
                console.error(e)
            }
        }
    }
})
