import {useApi} from "~/composable";

type Recurrence = 'per_month' | 'per_year'
interface BillingCycle {
    start_date: string;
    end_date: string;
    limit: number;
    usage: number;
}

interface Access {
    whatsapp: boolean;
    call_analytics: boolean;
    api_access: boolean;
}

interface Tariff {
    _id: string;
    tariff_id: string;
    recurrence: 'per_month' | 'per_year';
    userId: string;
    status: 'active' | 'inactive';
    created_at: string;
    recurrent: boolean;
    start_date: string;
    end_date: string;
    is_active: boolean;
    orderId: number;
    limit: number;
    paymentAmount: number;
    billing_cycles: BillingCycle[];
    type: 'tariff';
    access: Access;
    paymentUrl: string | null;
    payment_date: string;
}

export const useSubscriptionStore = defineStore('subscription', {

    state: () => {
        return {
            subscriptions: [] as Tariff[],
            subscriptionsServices: [] as Tariff[],
            subscriptionsWhatsapp: [] as Tariff[],
            pendingSubscriptions: [] as Tariff[],
            activeSubscriptions: [] as Tariff[],
            allSubscriptions: [] as Tariff[],
        }
    },

    getters: {
        getSubscriptions: (state) => state.subscriptions,
        getSubscriptionsServices: (state) => state.subscriptionsServices,
        getSubscriptionsWhatsapp: (state) => state.subscriptionsWhatsapp,
        getActiveSubscriptions: (state) => state.activeSubscriptions,
        getPendingSubscriptions: (state) => state.pendingSubscriptions,
        getAllSubscriptions: (state) => state.allSubscriptions,
    },

    actions: {
        async addSubscription(tariff_id: string, recurrence: Recurrence, currency: string) {
            try {
                return await useApi(`/subscription`, {
                    method: 'POST',
                    body: {
                        tariff_id,
                        recurrence,
                        currency
                    }
                });
            } catch (e) {
                console.error(e)
            }
        },

        async addSubscriptionService(service_id: string, recurrence: Recurrence, currency: string) {
            try {
                return await useApi(`/subscription`, {
                    method: 'POST',
                    body: {
                        service_id,
                        recurrence,
                        currency
                    }
                });
            } catch (e) {
                console.error(e)
            }
        },

        async addSubscriptionServiceWhatsapp(service_id: string, recurrence: Recurrence, quantity: number, currency: string) {
            try {
                return await useApi(`/subscription`, {
                    method: 'POST',
                    body: {
                        service_id,
                        recurrence,
                        quantity,
                        currency
                    }
                })
            } catch (e) {
                console.error(e)
            }
        },

        async cancelSubscription(tariff_id: string) {
            try {
                return await useApi(`/subscription/cancel/${tariff_id}`, {
                    method: 'POST',
                });
            } catch (e) {
                console.error(e)
            }
        },

        async loadSubscriptionsTariff(){
            try {
                this.subscriptions = await useApi(`/subscription/active?type=tariff`, {
                    method: 'GET'
                })
            } catch (e) {
                console.error(e)
            }
        },

        async loadSubscriptionsService(){
            try {
                const response = await useApi(`/subscription/active?type=call_analytics`, {
                    method: 'GET'
                })
                if (response?.message) {
                    return;
                } else {
                    this.subscriptionsServices = response;
                }
            } catch (e) {
                console.error(e)
            }
        },

        async loadSubscriptionsWhatsapp(){
            try {
                const response = await useApi(`/subscription/active?type=whatsapp`, {
                    method: 'GET'
                })
                if (response?.message) {
                    return;
                } else {
                    this.subscriptionsWhatsapp = response;
                }
            } catch (e) {
                console.error(e)
            }
        },

        async loadSubscriptionsGrouped(){
            try {
                const response = await useApi(`/subscription?grouped=true`, {
                    method: 'GET'
                })
                console.log(response);
            } catch (e) {
                console.error(e)
            }
        },

        async loadAllSubscriptionsG(){
            try {
                const response = await useApi(`/subscription`, {
                    method: 'GET'
                })
                console.log(response);
                this.allSubscriptions = response;
            } catch (e) {
                console.error(e)
            }
        },

        async upgradeTariff(tariff_id: string, recurrence: Recurrence, currency: string) {
            try {
                return  await useApi(`/subscription/upgrade`, {
                    method: 'PATCH',
                    body: {
                        tariff_id,
                        recurrence,
                        currency
                    }
                })
            } catch (e) {
                console.error(e)
            }
        },

        setSubscriptionUsage(usage: number) {
            this.subscriptions[0].billing_cycles[0].usage = usage
        },
        async subscriptionConsume() {
            try {
                const response = await useApi(`/subscription/consume`, {
                    method: 'POST',
                    body: {
                        // type: "subscription_activation",
                        serviceType: "tariff",
                        // message: "Ваша стартовая подписка активирована",
                        // createdAt:  "2024-09-29T07:48:08.711Z",
                        // isRead: false,
                        // isImportant: true,
                        // validFrom: {
                        //     $date: "2024-09-29T07:48:08.710Z"
                        // },
                        // validUntil: null,
                        // alwaysShowToast: false,
                        // data: {
                        //     subscriptionId: "66f906380bcd23299948bd7f",
                        //     daysRemaining: 365
                        // }
                    }
                })
                console.log(response);
            } catch (e) {
                console.error(e)
            }
        }
    }
})