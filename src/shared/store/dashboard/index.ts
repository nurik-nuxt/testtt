import {useApi} from "~/composable";

export const useDashboardStore = defineStore('dashboard', {
    state: () => {
        return {
            userStatistics: {
                newUsersThisMonth: 0 as number,
                newUsersThisYear: 0 as number,
                newUsersToday: 0 as number,
                totalUsers: 0 as number
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
            users: [] as any
        }
    },

    getters: {
        getUserStatistics: (state) => state.userStatistics,
        getBotsStatistics: (state) => state.botsStatistics,
        getLeadsStatistics: (state) => state.leadsStatistics,
        getUsers: (state) => state.users
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
        }
    }
})