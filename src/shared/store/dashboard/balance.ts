import {useApi} from "~/composable";

export const useDashboardBalanceStore = defineStore('balance-dashboard', {
    state: () => {
        return {
            sumToday: 0 as number,
            sumThisMonth: 0 as number,
            sumThisYear: 0 as number,
        }
    },
    getters: {
        getTodaySum: (state) => state.sumToday,
        getMonthSum: (state) => state.sumThisMonth,
        getYearSum: (state) => state.sumThisYear
    },
    actions: {
        async loadBalanceStatistics() {
            try {
                const result = await useApi(`/balance-sum-stats`, {
                    method: 'GET'
                }, true)
                if (result.success) {
                    this.sumToday = result.data.sumToday
                    this.sumThisMonth = result.data.sumThisMonth
                    this.sumThisYear = result.data.sumThisYear
                }
            } catch (e) {
                console.error(e)
            }
        }
    }
})