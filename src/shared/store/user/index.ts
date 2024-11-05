import {useApi} from "~/composable";

interface User {
    _id: string;
    email: string;
    name: string;
    phone: string;
    sources?: Source[];
    createdAt: number;
    analyzer?: Analyzer;
    isVerified: boolean;
    balance: number;
}

interface Source {
    _id: string;
    title: string;
    type: string;
    status: string;
    connected: boolean;
    connectedBotId: number | null;
    credentials?: Credentials;
    access_token?: string;
    webhook?: Webhook;
    user_id?: number;
    bitrix24BotId?: number;
    activePipelines?: Pipeline[];
}

interface Credentials {
    client_id: string;
    client_secret: string;
}

interface Webhook {
    isSet: boolean;
    url: string;
}

interface Pipeline {
    pipeline_id: number;
    active_statuses: number[];
}

interface Analyzer {
    apiKey: ApiKey;
    model: string;
}

interface ApiKey {
    type: string;
    value: EncryptedData;
}

interface EncryptedData {
    iv: string;
    encryptedData: string;
}


export const useUserStore = defineStore('user', {

    state: () => {
        return {
            user: null as User | null
        }
    },

    getters: {
        userData: (state) => state.user
    },

    actions: {
        async fetchUserInfo() {
            try {
                const response = await useApi(`/user/me`, {
                    method: 'GET'
                })
                if (response) {
                    this.user = response;
                }
            } catch (e) {
                console.log(e)
            }
        },

        async consumeBalance(amount: number, currency: string) {
            try {
                const response = await useApi('/user/replenish/balance', {
                    method: 'POST',
                    body: {
                        amount,
                        currency
                    }
                })
                if (response?.success) {
                    console.log(response)
                    return response?.paymentUrl
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
})