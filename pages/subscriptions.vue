<script setup lang="ts">
import { useSubscriptionStore } from "~/src/shared/store/subscription";
import {formatDateToDDMMYYYY} from "~/src/shared/utils/helpers";
import {it} from "node:test";
const subscriptionStore = useSubscriptionStore();
const { t } = useI18n();

watchEffect(async () => {
  await subscriptionStore.loadAllSubscriptionsG()
})

const subscriptions = computed(() => {
  return subscriptionStore.getAllSubscriptions
})

const test = [
  {
    id: "66eeb318ca68fc027c7a867c",
    name: "base_100",
    display_name: "Base",
    rus_name: "Базовый",
    price_per_month: 1100,
    price_per_year: 11000,
    access: {
      whatsapp: true,
      call_analytics: true,
      api_access: true
    },
    limits: {
      leads: 100
    },
    version: 1,
    is_active: true,
    start_date: "2024-09-18T00:00:00.000Z",
    end_date: "2025-09-18T00:00:00.000Z"
  },
  {
    id: "66eeb318ca68fc027c7a867d",
    name: "base_300",
    display_name: "Base",
    rus_name: "Базовый",
    price_per_month: 2990,
    price_per_year: 29900,
    access: {
      whatsapp: true,
      call_analytics: true,
      api_access: true
    },
    limits: {
      leads: 300
    },
    version: 1,
    is_active: true,
    start_date: "2024-09-18T00:00:00.000Z",
    end_date: "2025-09-18T00:00:00.000Z"
  },
  {
    id: "66eeb318ca68fc027c7a8678",
    name: "base_600",
    display_name: "Base",
    rus_name: "Базовый",
    price_per_month: 3990,
    price_per_year: 39900,
    access: {
      whatsapp: true,
      call_analytics: true,
      api_access: true
    },
    limits: {
      leads: 600
    },
    version: 1,
    is_active: true,
    start_date: "2024-09-18T00:00:00.000Z",
    end_date: "2025-09-18T00:00:00.000Z"
  },
  {
    id: "66eeb318ca68fc027c7a8679",
    name: "base_2000",
    display_name: "Base",
    rus_name: "Базовый",
    price_per_month: 5990,
    price_per_year: 59900,
    access: {
      whatsapp: true,
      call_analytics: true,
      api_access: true
    },
    limits: {
      leads: 2000
    },
    version: 1,
    is_active: true,
    start_date: "2024-09-18T00:00:00.000Z",
    end_date: "2025-09-18T00:00:00.000Z"
  },
  {
    id: "66eeb318ca68fc027c7a867a",
    name: "base_5000",
    display_name: "Base",
    rus_name: "Базовый",
    price_per_month: 7990,
    price_per_year: 79900,
    access: {
      whatsapp: true,
      call_analytics: true,
      api_access: true
    },
    limits: {
      leads: 5000
    },
    version: 1,
    is_active: true,
    start_date: "2024-09-18T00:00:00.000Z",
    end_date: "2025-09-18T00:00:00.000Z"
  },
  {
    id: "66eeb318ca68fc027c7a867b",
    name: "start",
    display_name: "Start",
    rus_name: "Старт",
    price_per_month: 0,
    price_per_year: 0,
    access: {
      whatsapp: false,
      call_analytics: false,
      api_access: false
    },
    limits: {
      leads: 20
    },
    version: 1,
    is_active: true,
    start_date: "2024-09-18T00:00:00.000Z",
    end_date: "2025-09-18T00:00:00.000Z"
  },
  {
    id: "66eeb318ca68fc027c7a8677",
    name: "integrator",
    display_name: "Integrator",
    rus_name: "Интегратор",
    price_per_month: 0,
    price_per_year: 0,
    access: {
      whatsapp: true,
      call_analytics: true,
      api_access: true
    },
    limits: {
      leads: 5000
    },
    version: 1,
    is_active: true,
    start_date: "2024-09-18T00:00:00.000Z",
    end_date: "2025-09-18T00:00:00.000Z",
    forFront: {
      order: -1,
      color: "#00FFDD",
      isSpecial: true,
      specialty: "for_integrators",
      size: "normal",
      isFeatured: false,
      isMostOptimal: false,
      isInitiallyHidden: true
    }
  },
  {
    id: "66eeb319ca68fc027c7a867e",
    name: "pro",
    display_name: "Pro",
    rus_name: "Про",
    price_per_month: 15990,
    price_per_year: 159900,
    access: {
      whatsapp: true,
      call_analytics: true,
      api_access: true
    },
    limits: {
      leads: 20000
    },
    version: 1,
    is_active: true,
    start_date: "2024-09-18T00:00:00.000Z",
    end_date: "2025-09-18T00:00:00.000Z"
  }
]

</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <h5 class="mb-6">{{ $t('subscription')}}</h5>
        <div v-if="subscriptions" class="grid md:flex-row flex-column align-items-center gap-5">
          <div class="tariff-card" v-for="subscriptionCallAnalytics in subscriptions" :key="subscriptionCallAnalytics._id">
            <div class="flex gap-2 align-items-center">
              <span class="font-bold">{{ subscriptionCallAnalytics.type === 'tariff' ? `Тариф ${test?.find((item) => item.id === subscriptionCallAnalytics.tariff_id)?.rus_name}` : subscriptionCallAnalytics.type === 'whatsapp' ? 'Whats App' : 'Аналитика звонков' }}</span>
            </div>
            <div class="flex gap-2 align-items-center">
              <span>Создано:</span>
              <span class="font-bold">{{ formatDateToDDMMYYYY(subscriptionCallAnalytics?.created_at) }}</span>
            </div>
            <div class="flex gap-2 align-items-center">
              <span>Статус:</span>
              <span v-if="subscriptionCallAnalytics?.status === 'pending'" class="font-bold" style="color: rgb(249, 117, 62)">Ожидание оплаты</span>
              <span v-if="subscriptionCallAnalytics?.status === 'active'" class="font-bold" style="color: #10b981">Подключено</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>