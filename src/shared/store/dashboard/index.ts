import {useApi} from "~/composable";

interface InsideToken {
    _id: string;
    name: string;
    priceInputToken: number;
    priceOutputToken: number;
}
export const useDashboardStore = defineStore('dashboard', {
    state: () => {
        return {
            isLoadingTariffStatisticsSums: false as boolean,
            paidUsersCount: 0 as number,
            isLoadingPaidUsersCount: false as boolean,
            userStatistics: {
                newUsersThisMonth: 0 as number,
                newUsersThisYear: 0 as number,
                newUsersToday: 0 as number,
                totalUsers: 0 as number
            },
            tariffStatistics: {
                newUsersThisMonth: 0 as number,
                newUsersThisYear: 0 as number,
                newUsersToday: 0 as number,
            },
            tariffStatisticsSums: {
                newUsersThisMonth: 0 as number,
                newUsersThisYear: 0 as number,
                newUsersToday: 0 as number,
            },
            botsStatistics: {
                totalBots: 0 as number,
                activeBots: 0 as number,
                inactiveBots: 0 as number
            },
            leadsStatistics: {
                totalLeadsCount: 0 as number,
                totalAssistantMessagesCount: 0 as number
            },
            users: [] as any,
            insideTokens: [] as InsideToken[]
        }
    },

    getters: {
        getUserStatistics: (state) => state.userStatistics,
        getBotsStatistics: (state) => state.botsStatistics,
        getLeadsStatistics: (state) => state.leadsStatistics,
        getUsers: (state) => state.users,
        getTariffStatistics: (state) => state.tariffStatistics,
        getTariffStatisticsSums: (state) => state.tariffStatisticsSums,
        getLoadingTariffStatisticsSums: (state) => state.isLoadingTariffStatisticsSums,
        getPaidUsersCount: (state) => state.paidUsersCount,
        getLoadingPaidUsersCount: (state) => state.isLoadingPaidUsersCount,
        getInsideTokens: (state) => state.insideTokens
    },

    actions: {
        async loadUserStatistics() {
            try {
                const response = await useApi(`/users`, {
                    method: 'GET'
                }, true)
                if (response?.success) {
                    this.userStatistics = response?.data?.stats
                }
            } catch (e) {
                console.error(e)
            }
        },

        async loadBotsStatistics() {
            try {
                const response = await useApi(`/bots`, {
                    method: 'GET'
                }, true)
                if (response?.success) {
                    this.botsStatistics = response?.data?.bots
                }
            } catch (e) {
                console.error(e)
            }
        },

        async loadLeadsStatistics() {
            try {
                const response = await useApi('/user-leads', {
                    method: 'GET'
                }, true)
                if (response?.success) {
                    this.leadsStatistics = response?.data?.leads
                }
            } catch (e) {
                console.error(e)
            }
        },

        async loadTariffStatistics() {
            try {
                const response = await useApi('/active-subscriptions-stats', {
                    method: 'GET'
                }, true)
                console.log(response);
                if (response?.success) {
                    this.tariffStatistics = response?.data
                }
            } catch (e) {
                console.error(e)
            }
        },

        async loadTariffStatisticsSums() {
            try {
                this.isLoadingTariffStatisticsSums = true
                const response = await useApi('/total-tariff-sum', {
                    method: 'GET'
                }, true)
                console.log(response);
                if (response?.success) {
                    this.tariffStatisticsSums = response?.data
                }
            } catch (e) {
                console.error(e)
            } finally {
                this.isLoadingTariffStatisticsSums = false
            }
        },
        async loadUsersTariffPayCount() {
            try {
                this.isLoadingPaidUsersCount = true
                const response = await useApi('/paid-users-count', {
                    method: 'GET'
                }, true)
                console.log('loadUsersTariffPayCount', response)
                if(response?.success) {
                    this.paidUsersCount = response?.data?.paidUsersCount
                }
            } catch (e) {
                console.error(e)
            } finally {
                this.isLoadingPaidUsersCount = false
            }
        },

        async loadUsers(withTariff: boolean = false) {
            try {
                // Build the URL based on the value of withTariff
                const url = withTariff ? `/user-list?with-tariff=true` : `/user-list`;

                const response = await useApi(url, {
                    method: 'GET'
                }, true);

                if (response?.data?.users?.length) {
                    this.users = response?.data?.users;
                }
            } catch (e) {
                console.error(e);
            }
        },

        async deleteUser(userId: string) {
            try {
                return await useApi(`/user/${userId}`, {
                    method: 'DELETE'
                }, true);
            } catch (e) {
                console.error(e)
            }
        },

        async loadTariffsToken(){
            try {
                const response = await useApi('/inside-tokens', {
                    method: 'GET'
                },true)
                console.log(response)
                if (response.success) {
                    this.insideTokens = response?.data?.tokens
                }
            } catch (e) {
                console.log(e)
            }
        },

        async changeTokenPrice(id: string, priceInputToken: number, priceOutputToken: number) {
            try {
                return await useApi('/update-token-tariff', {
                    method: 'PUT',
                    body: {
                        id,
                        priceInputToken,
                        priceOutputToken
                    }
                }, true);
            } catch (e) {
                console.log(e)
            }
        }
    }
})
