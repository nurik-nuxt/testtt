import { useApi } from "~/composable";

interface Tariff {
    _id: string;
    name: string;
    display_name: string;
    rus_name: string;
    price_per_month: number;
    price_per_year: number;
    access: Access;
    limits: Limits;
    version: number;
    is_active: boolean;
    start_date: string;
    end_date: string;
}

interface Access {
    whatsapp: boolean;
    call_analytics: boolean;
    api_access: boolean;
}

interface Limits {
    leads: number;
}

interface Service {
    _id: string;
    name: string;
    type: string;
    price_per_month: number;
    price_per_year: number;
    start_date: string;
    end_date: string;
    fixed: boolean;
    is_active: boolean;
    rus_name: string;
    unlimited?: boolean;
    quantity?: number;
}

interface UpgradePrices {
    difference_month_price: number;
    difference_year_price: number;
}

interface UpgradableTariff extends Tariff {
    upgrade_prices: UpgradePrices;
}

export const useTariffsStore = defineStore('tariffs', {

    state: () => {
        return {
            tariffs: [] as Tariff[],
            services: [] as Service[],
            is_upgradable: false as boolean,
            upgradable_tariffs: [] as UpgradableTariff[]
        }
    },

    getters: {
      getTariffs: (state) => state.tariffs,
      getServices: (state) => state.services,
      getIsUpgradable: (state) => state.is_upgradable,
      getUpgradableTariffs: (state) => state.upgradable_tariffs
    },
    actions: {
        async loadTariffs() {
            try {
                const response = await useApi(`/tariffs`, {
                    method: 'GET'
                })
                if (response?.tariffs?.length) {
                    this.tariffs = response?.tariffs
                }
                if (response?.services?.length) {
                    this.services = response?.services
                }
            } catch (e) {
                console.error(e)
            }
        },
        async loadUpgradableTariffs() {
            try {
                const response = await useApi(`/tariffs/upgradable`, {
                    method: 'GET'
                })
                if (response?.is_upgradable) {
                    this.is_upgradable = response?.is_upgradable
                    this.upgradable_tariffs = response?.withPrices
                }
            } catch (e) {
                console.error(e)
            }
        },

        async assignTariff(data: { email: string; tariff_id?: string; recurrence?: 'per_month' | 'per_year' }[]) {
            try {
                return  await useApi(`/subscription/assign-tariff`, {
                    method: 'POST',
                    body: JSON.stringify(data)
                })
            } catch (e) {
                console.error(e)
            }
        },

        async assignServiceByAdmin(data: any) {
            try {
                return await useApi(`/subscription/assign-service`, {
                    method: 'POST',
                    body: data
                })
            } catch (e) {
                console.error(e)
            }
        },

        async assignTariffByAdmin(data: any) {
            try {
                return await useApi(`/subscription/assign-tariff`, {
                    method: 'POST',
                    body: data
                })
            } catch (e) {
                console.error(e)
            }
        }
    }
})