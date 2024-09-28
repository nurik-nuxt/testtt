<script setup lang="ts">
import { thousandSeparator } from "~/src/shared/utils/helpers";
import { useTariffsStore } from "~/src/shared/store/tariffs";
import { useSubscriptionStore } from "~/src/shared/store/subscription";
import { formatDateToDDMMYYYY } from "~/src/shared/utils/helpers"

const { t } = useI18n();
const subscriptionStore = useSubscriptionStore();
const autoRenewal = ref(true)

const channelCount = ref(2)

const totalPrice = ref(50)

const currencyValue = ref<string>('rub')

const currencyList = ref<{ title: string; value: string; diff: number }[]>(
    [
      {
        title: 'Руб',
        value: 'rub',
        diff: 1
      },
      {
        title: 'Тнг',
        value: 'tng',
        diff: 5.5
      },
      {
        title: '$',
        value: 'dollar',
        diff: 0.01
      }
    ]
)
const totalTariffTime = ref<'per_month' | 'per_year'>('per_month')

const tariffTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: 'в мес',
        value: 'per_month'
      },
      {
        title: 'в год',
        value: 'per_year'
      }
    ]
)

const basicClientCount = ref<number>(300)
const basicClientCountList = ref<{ title: string; value: number; priceInMonth: number; priceInYear: number }[]>(
    [
      {
        title: '100',
        value: 100,
        priceInMonth: 1100,
        priceInYear: 11000,
      },
      {
        title: '300',
        value: 300,
        priceInMonth: 2990,
        priceInYear: 29900,
      },
      {
        title: '600',
        value: 600,
        priceInMonth: 3990,
        priceInYear: 39900,
      },
      {
        title: '2000',
        value: 2000,
        priceInMonth: 5990,
        priceInYear: 59900,
      },
      {
        title: '5000',
        value: 5000,
        priceInMonth: 7990,
        priceInYear: 79900,
      }
    ]
)

const basicTariffSum = computed(() => {
  if (totalTariffTime.value === 'per_month') {
    return basicClientCountList.value?.find((item) => item.value === basicClientCount.value)?.priceInMonth
  } else {
    return basicClientCountList.value?.find((item) => item.value === basicClientCount.value)?.priceInYear
  }
})
const proClientCount = ref<number>(20000)
const proClientCountList = ref<{ title: string; value: number; priceInMonth: number; priceInYear: number }[]>(
    [
      {
        title: '20000',
        value: 20000,
        priceInMonth: 15990,
        priceInYear: 159900,
      }
    ]
)
const proTariffSum = computed(() => {
  if (totalTariffTime.value === 'per_month') {
    return proClientCountList.value?.find((item) => item.value === proClientCount.value)?.priceInMonth
  } else {
    return proClientCountList.value?.find((item) => item.value === proClientCount.value)?.priceInYear
  }
})
const premiumClientCount = ref<string>('unlimited')
const premiumClientCountList = ref<{ title: string; value: string; priceInMonth: number; priceInYear: number }[]>(
    [
      {
        title: 'Не ограничено ∞',
        value: 'unlimited',
        priceInMonth: 15990,
        priceInYear: 159900,
      }
    ]
)

const startClientCount = ref<string>('20')
const startClientCountList = ref<{ title: string; value: string }[]>([
  {
    title: '20',
    value: '20'
  }
])

const premiumTariffSum = computed(() => {
  if (totalTariffTime.value === 'per_month') {
    return premiumClientCountList.value?.find((item) => item.value === premiumClientCount.value)?.priceInMonth
  } else {
    return premiumClientCountList.value?.find((item) => item.value === premiumClientCount.value)?.priceInYear
  }
})

const totalAnalyticsTariffTime = ref<'per_month' | 'per_year'>('per_month')

const tariffAnalyticsTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: 'в мес',
        value: 'per_month'
      },
      {
        title: 'в год',
        value: 'per_year'
      }
    ]
)
const analyticsPrice = ref<number | string>(500)
const analyticsPriceList = ref([
  {
    title: '500',
    value: 500,
    priceInMonth: 1100,
    priceInYear: 11000,
  },
  {
    title: '1000',
    value: 1000,
    priceInMonth: 1990,
    priceInYear: 19900,
  },
  {
    title: '2000',
    value: 2000,
    priceInMonth: 2990,
    priceInYear: 29900,
  },
  {
    title: '∞',
    value: 'unlimited',
    priceInMonth: 4990,
    priceInYear: 49900,
  }
])

const analyticsPriceSum = computed(() => {
  if (totalAnalyticsTariffTime.value === 'per_month') {
    return analyticsPriceList.value?.find((item) => item.value === analyticsPrice.value)?.priceInMonth
  } else {
    return analyticsPriceList.value?.find((item) => item.value === analyticsPrice.value)?.priceInYear
  }
})

const totalWhatsAppTariffTime = ref<'per_month' | 'per_year'>('per_month')

const tariffWhatsAppTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: 'в мес',
        value: 'per_month'
      },
      {
        title: 'в год',
        value: 'per_year'
      }
    ]
)

const whatsAppChannelCount = ref<number>(1)

const whatsAppChannelPrice = computed(() => {
  if (totalWhatsAppTariffTime.value === 'per_month') {
    return whatsAppChannelCount.value * 1990
  } else {
    return whatsAppChannelCount.value * 19900
  }
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

const services = [
  {
    id: "66e959485b04b04f540602fc",
    name: "whatsapp_1",
    type: "whatsapp",
    price_per_month: 1990,
    price_per_year: 19900,
    start_date: "2024-09-15T19:00:00.000Z",
    end_date: "2025-09-16T19:00:00.000Z",
    fixed: false,
    is_active: true
  },
  {
    id: "66ef4f66899aa7a630b637b1",
    name: "call_analytics_500",
    type: "call_analytics",
    quantity: 500,
    price_per_month: 1100,
    price_per_year: 11000,
    start_date: "2024-09-21T22:57:42.448Z",
    end_date: "2025-09-21T22:57:42.448Z",
    is_active: true
  },
  {
    id: "66f02607972583e8e6283852",
    name: "call_analytics_1000",
    type: "call_analytics",
    quantity: 1000,
    price_per_month: 1990,
    price_per_year: 19900,
    start_date: "2024-09-22T14:13:27.784Z",
    end_date: "2025-09-22T14:13:27.784Z",
    is_active: true
  },
  {
    id: "66f0261efd6a4925aa5ee4c7",
    name: "call_analytics_2000",
    type: "call_analytics",
    quantity: 2000,
    price_per_month: 2990,
    price_per_year: 29900,
    start_date: "2024-09-22T14:13:50.471Z",
    end_date: "2025-09-22T14:13:50.471Z",
    is_active: true
  },
  {
    id: "66f02627239288b4e2064605",
    name: "call_analytics_unlimited",
    type: "call_analytics",
    unlimited: true,
    price_per_month: 4990,
    price_per_year: 49900,
    start_date: "2024-09-22T14:13:59.338Z",
    end_date: "2025-09-22T14:13:59.338Z",
    is_active: true
  },
  {
    id: "66f02659acb8400cf7041933",
    name: "additional_user_1",
    type: "additional_user",
    price_per_month: 490,
    quantity: 1,
    start_date: "2024-09-22T14:14:48.995Z",
    end_date: "2025-09-22T14:14:48.995Z",
    is_active: true
  }
]

const basicPlans = computed(() => {
  return test.filter(plan => plan.name.startsWith('base'));
});

const proPlans = computed(() => {
  return test.filter(plan => plan.name.startsWith('pro'))
})



const analyticsServices = computed(() =>
    services.filter(service => service.type === 'call_analytics')
        .map(service => ({
          id: service.id,
          title: service.unlimited ? '∞' : service.quantity,
          value: service.unlimited ? 'unlimited' : service.quantity,
          priceInMonth: service.price_per_month,
          priceInYear: service.price_per_year,
        }))
);

const basicClientOptions = computed(() => {
  return basicPlans.value.map(plan => ({
    title: plan.limits.leads,
    value: plan.limits.leads,
  }));
});

const proClientOptions = computed(() => {
  return proPlans.value.map(plan => ({
    title: plan.limits.leads,
    value: plan.limits.leads,
  }));
});

const payBasicPlan = async () => {
  const planId = test?.find((plan) => plan?.limits?.leads === basicClientCount.value)?.id;

  if (!planId) {
    console.error('Plan ID not found.');
    return;
  }

  try {
    const initialResponse = await subscriptionStore.addSubscription(planId, totalTariffTime.value);

    if (initialResponse?.success) {
      window.open(initialResponse?.dataForFront?.paymentUrl, '_blank');
      return;
    }

    if (initialResponse?.error === 'already have active or pending subscription, please delete them') {
      const cancelResponse = await subscriptionStore.cancelSubscription(initialResponse?.subscriction_id);

      if (cancelResponse?.success) {
        const retryResponse = await subscriptionStore.addSubscription(planId, totalTariffTime.value);

        if (retryResponse?.success) {
          window.open(retryResponse?.dataForFront?.paymentUrl, '_blank');
        } else {
          console.error('Error in retrying subscription:', retryResponse?.error);
        }
      } else {
        console.error('Error in canceling subscription:', cancelResponse?.error);
      }
    } else {
      console.error('Error in initial subscription:', initialResponse?.error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};
const payProPlan = () => {
  const planId = test?.find((plan) => plan?.limits?.leads === proClientCount.value)?.id;
  console.log(planId);
}

const payAnalyticsService = async () => {
  const serviceId = services.find(
      (service) =>
          service.quantity === analyticsPrice.value ||
          (analyticsPrice.value === 'unlimited' && service.unlimited)
  )?.id;
  if (serviceId) {
    await subscriptionStore.addSubscriptionService(serviceId, totalAnalyticsTariffTime.value).then(async (res) => {
      if (res?.success) {
        window.open(res?.dataForFront?.paymentUrl, '_blank');
      } else {
        await subscriptionStore.cancelSubscription(serviceId).then(async () => {
          if (res?.success) {
            await subscriptionStore.addSubscriptionService(serviceId, totalAnalyticsTariffTime.value)
          }
        })
      }
    })
  }
}

watchEffect(async () => {
  await subscriptionStore.loadSubscriptionsTariff()
  await subscriptionStore.loadSubscriptionsService()
  await subscriptionStore.loadSubscriptionsWhatsapp()
})

const subscriptions = computed(() => {
  return subscriptionStore.getSubscriptions
});

const subscriptionsServices = computed(() => {
  return subscriptionStore.getSubscriptionsServices
});

const subscriptionsWhatsapp = computed(() => {
  return subscriptionStore.getSubscriptionsWhatsapp
});

const payWhatsappService = async () => {
  const serviceId = services?.find((service) => service.type === 'whatsapp')?.id;
  if (serviceId) {
    await subscriptionStore.addSubscriptionServiceWhatsapp(serviceId, totalWhatsAppTariffTime.value, whatsAppChannelCount.value).then((res) => {
      console.log(res);
      if (res?.success) {
        window.open(res?.dataForFront?.paymentUrl, '_blank');
      }
    })
  }
};

const showUpgradeModal = ref<boolean>(false)
const upgradeTariff = () => {
  showUpgradeModal.value = true
}

const selectedUpgradeTariffId = ref()

const activeTariff = computed(() => {
  return subscriptionStore.getSubscriptions?.find(subscription => subscription.type === 'tariff' && subscription.status === 'active');
});

const activeTariffLeads = computed(() => {
  const activeTariff = subscriptionStore.getSubscriptions?.find((subscription) => subscription.type === 'tariff' && subscription.status === 'active');
  return activeTariff ? activeTariff.billing_cycles[0].limit : 0;
});

const activeTariffRecurrence = computed(() => {
  // Assuming 'per_month' or 'per_year' is stored somewhere in the active tariff data
  return activeTariff.value ? activeTariff.value.billing_cycles[0].recurrence : 'per_month'; // Default to 'per_month' if not found
});

const upgradedTariffs = computed(() => {
  return test
      .filter(tariff => tariff.name !== 'start' && tariff.name !== 'integrator' && tariff.limits.leads > activeTariffLeads.value)  // Only higher tariffs
      .map((item) => {
        const price = totalTariffTime.value === 'per_month'
            ? thousandSeparator(item.price_per_month)
            : thousandSeparator(item.price_per_year);

        const currencyTitle = currencyList.value.find((currency) => currency.value === currencyValue.value)?.title;

        return {
          ...item,
          full_name: `${item.display_name} - ${item.limits.leads}, ${price} ${currencyTitle}`,
        };
      });
});
const payUpgradeTariff = async () => {
  if (selectedUpgradeTariffId.value) {
    await subscriptionStore.upgradeTariff(selectedUpgradeTariffId.value, totalUpgradeTariffTime.value).then((res) => {
      console.log(res?.paymentUrl);
      window.open(res?.paymentUrl, '_blank');
      showUpgradeModal.value = false
    })
  }
  // await subscriptionStore.upgradeTariff()
}

const totalUpgradeTariffTime = ref<'per_month' | 'per_year'>('per_month')

const tariffUpgradeTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: 'в мес',
        value: 'per_month'
      },
      {
        title: 'в год',
        value: 'per_year'
      }
    ]
)

const changeRecurrence = () => {
  selectedUpgradeTariffId.value = null
}
</script>

<template>
  <Dialog v-model:visible="showUpgradeModal" :style="{ width: '450px' }" header="Выберите тариф" :modal="true" class="p-fluid">
    <div class="mb-4">
      <SelectButton v-model="totalUpgradeTariffTime" :options="tariffUpgradeTimeList" option-label="title" option-value="value" :allow-empty="false" @change="changeRecurrence" />
    </div>
    <Dropdown
        v-model="selectedUpgradeTariffId"
        :options="upgradedTariffs"
        class="w-full"
        option-value="id"
        option-label="full_name"
    >
      <template #option="slotProps">
        <div class="flex justify-content-between align-items-center w-full">
          <span>{{ slotProps.option.display_name }} - {{ slotProps.option.limits.leads }}</span>
          <span class="font-bold">
        {{ totalUpgradeTariffTime === 'per_month'
              ? thousandSeparator(slotProps.option.price_per_month)
              : thousandSeparator(slotProps.option.price_per_year) }}
        {{ currencyList?.find((item) => item.value === currencyValue)?.title }}
      </span>
        </div>
      </template>

      <template #item="slotProps">
        <div class="flex justify-content-between align-items-center w-full">
          <span>{{ slotProps.option.display_name }} - {{ slotProps.option.limits.leads }}</span>
          <span class="font-bold">
        {{ totalUpgradeTariffTime === 'per_month'
              ? thousandSeparator(slotProps.option.price_per_month)
              : thousandSeparator(slotProps.option.price_per_year) }}
        {{ currencyList?.find((item) => item.value === currencyValue)?.title }}
      </span>
        </div>
      </template>
    </Dropdown>
    <Button label="Обновить тариф" class="mt-4" @click="payUpgradeTariff"></Button>
  </Dialog>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between items-center mb-4 align-items-center">
          <h5 class="mb-0">{{ $t('myPlan') }}</h5>
          <SelectButton v-model="currencyValue" :options="currencyList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false" />
        </div>
        <div class="flex flex-column gap-8">
          <div class="grid md:flex-row flex-column align-items-center gap-5">
            <div v-if="subscriptions?.length" class="tariff-card">
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('currentPlan') }}:</span>
                <span class="font-bold">{{ test?.find((item) => item.id === subscriptions?.find((subscription) => subscription.type === 'tariff'  && subscription.status === 'active')?.tariff_id)?.rus_name}}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('used') }}:</span>
                <span class="font-bold">{{ subscriptions?.find((subscription) => subscription.type === 'tariff'  && subscription.status === 'active')?.billing_cycles[0]?.usage }} {{ $t('of') }} {{ subscriptions?.find((subscription) => subscription.type === 'tariff'  && subscription.status === 'active')?.billing_cycles[0]?.limit }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('validUntil') }}:</span>
                <span class="font-bold">{{ formatDateToDDMMYYYY(subscriptions?.find((subscription) => subscription.type === 'tariff'  && subscription.status === 'active')?.end_date) }}</span>
              </div>
<!--              <div class="flex gap-2 align-items-center">-->
<!--                <span>{{ $t('autoRenewal') }}:</span>-->
<!--                <span class="flex align-items-center font-bold">-->
<!--                  {{ $t('switch') }}-->
<!--                  <InputSwitch v-model="autoRenewal" style="margin-left: 8px"/></span>-->
<!--              </div>-->
              <div class="flex flex-column gap-2">
                <span>Улучшить тариф до:</span>
                <Button label="Обновить" class="p-3 mt-auto" style="height: 30px; width: 50%" @click="upgradeTariff"></Button>
              </div>
            </div>
            <div class="tariff-card" v-for="subscriptionCallAnalytics in subscriptionsServices" :key="subscriptionCallAnalytics._id">
              <div class="flex gap-2 align-items-center">
                <span class="font-bold">{{ $t('callAnalytics') }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('validUntil') }}:</span>
                <span class="font-bold">{{ formatDateToDDMMYYYY(subscriptionCallAnalytics?.end_date) }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('used') }}:</span>
                <span class="font-bold">{{ subscriptionCallAnalytics?.billing_cycles[0]?.usage }} {{ $t('of') }} {{ subscriptionCallAnalytics?.billing_cycles[0]?.limit }}</span>
              </div>
            </div>

            <div class="tariff-card" v-for="subscriptionCallAnalytics in subscriptionsWhatsapp" :key="subscriptionCallAnalytics._id">
              <div class="flex gap-2 align-items-center">
                <span class="font-bold">{{ $t('connectedChannels1') }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('validUntil') }}:</span>
                <span class="font-bold">{{ formatDateToDDMMYYYY(subscriptionCallAnalytics?.end_date) }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('used') }}:</span>
                <span class="font-bold">{{ subscriptionCallAnalytics?.billing_cycles[0]?.usage }} {{ $t('of') }} {{ subscriptionCallAnalytics?.billing_cycles[0]?.limit }}</span>
              </div>
            </div>

          </div>
          <BlockViewer header="Pricing" free>
            <div>
              <div class="flex align-items-center mb-4 gap-4 mobile">
                <h5 class="mb-0">{{ $t('activatePlan') }}</h5>
                <div class="flex align-items-center gap-2">
                  <SelectButton v-model="totalTariffTime" :options="tariffTimeList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false" />
                  <span class="ml-2 mobile-dis" style="color: #ef4444; font-weight: 600">-20%</span>
                </div>
              </div>
              <div class="grid">
                <!-- Start Plan -->
                <div class="col-12 lg:col-3">
                  <div class="h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">Start</div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('uniqueClients') }}</span>
                        </li>
                        <div class="mb-4">
                          <SelectButton v-model="startClientCount" :options="startClientCountList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>
                        </div>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('crmIntegrations') }}</span>
                        </li>
                      </ul>
                      <span class="mb-2 font-bold text-2xl">Бесплатно</span>
                    </div>
                  </div>
                </div>

<!--                <pre>{{ subscriptions }}</pre>-->

                <!-- Basic Plan -->
                <div class="col-12 lg:col-5">
                  <div class="h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">Base</div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('uniqueClients') }}</span>
                        </li>
                        <div class="mb-4">
                          <SelectButton v-model="basicClientCount" :options="basicClientOptions" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>
                        </div>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('onlineChat') }} {{ $t('freePlan') }}</span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('crmIntegrations') }}</span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('supportTarif247') }}</span>
                        </li>
                      </ul>
                      <div class="flex flex-column gap-1 mb-4">
                        <span>К оплате</span>
                        <span class="font-bold text-2xl">{{ thousandSeparator(basicTariffSum * currencyList?.find((item) => item.value === currencyValue)?.diff) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button label="Оплатить" class="p-3 w-full mt-auto" @click="payBasicPlan" :disabled="!!subscriptions?.length"></Button>
                    </div>
                  </div>
                </div>

                <!-- Pro Plan -->
                <div class="col-12 lg:col-4">
                  <div class="h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px; background-color: #e7f9e7;">
                      <div class="text-900 font-medium text-xl mb-2">Pro</div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('uniqueClients') }}</span>
                        </li>
                        <div class="mb-4">
                          <SelectButton v-model="proClientCount" :options="proClientOptions" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>
                        </div>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('onlineChat') }} {{ $t('freePlan') }}</span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('crmIntegrations') }}</span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('supportTarif247') }}</span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('callAnalytics') }}<span style="font-weight: 700; margin-left: 5px">100 звонков</span></span>
                        </li>
                      </ul>
                      <div class="flex flex-column gap-1 mb-4">
                        <span>К оплате</span>
                        <span class="font-bold text-2xl">{{ thousandSeparator(proTariffSum * currencyList?.find((item) => item.value === currencyValue)?.diff) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button label="Оплатить" class="p-3 w-full mt-auto" @click="payProPlan" :disabled="!!subscriptions?.length"></Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </BlockViewer>

          <BlockViewer header="analytics" free>
            <div>
              <div class="flex align-items-center mb-4 gap-4 mobile">
                <h5 class="mb-0">{{ $t('callAnalytics') }}</h5>
                <div class="flex align-items-center gap-2">
                  <SelectButton v-model="totalAnalyticsTariffTime" :options="tariffAnalyticsTimeList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>
                  <span class="ml-2" style="color: #ef4444; font-weight: 600">-20%</span>
                </div>
              </div>
              <div class="grid">
                <div class="col-12 lg:col-4">
                  <div class="h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">Количество звонков в мес.</div>
                      <div class="mb-2 mt-2">
                        <SelectButton v-model="analyticsPrice" :options="analyticsServices" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>
                      </div>
                      <div class="text-900 font-medium mb-5">Доступно только для amoCRM и Bitrix24</div>
                      <div class="flex flex-column gap-1 mb-4">
                        <span>К оплате</span>
                        <span class="font-bold text-2xl">{{ thousandSeparator(analyticsPriceSum * currencyList?.find((item) => item.value === currencyValue)?.diff) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button label="Оплатить" class="p-3 w-full mt-auto" @click="payAnalyticsService"></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BlockViewer>

          <BlockViewer header="whatsApp" free>
            <div>
              <div class="flex align-items-center mb-4 mobile">
                <h5 class="mb-0 mr-4">Оплатить канал WhatsApp</h5>
                <div class="flex align-items-center gap-2">
                  <SelectButton v-model="totalWhatsAppTariffTime" :options="tariffWhatsAppTimeList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>
                  <span style="color: #ef4444; font-weight: 600">-20%</span>
                </div>
              </div>
              <div class="grid">
                <div class="col-12 lg:col-3">
                  <div class="h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">Количество каналов WhatsApp</div>
                      <InputText id="premium-channel-count" style="width: 50px" type="number" min="0" v-model="whatsAppChannelCount" />
                      <div class="flex flex-column gap-1 mt-4 mb-4">
                        <span>К оплате</span>
                        <span class="font-bold text-2xl">{{ thousandSeparator(whatsAppChannelPrice * currencyList?.find((item) => item.value === currencyValue)?.diff) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button label="Оплатить" class="p-3 w-full mt-auto" @click="payWhatsappService"></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BlockViewer>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-header {
  @media (max-width: 601px) {
    margin-right: 4px !important;
    font-size: 16px !important;
  }
}

.mobile-dis {
  @media (max-width: 601px) {
    margin-left: 4px !important;
  }
}

.mobile {
  @media (max-width: 601px) {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start;
    gap: 8px
  }
}
:deep(.p-selectbutton .p-button.p-highlight::before) {
  background: #076AE1;
}
:deep(.p-selectbutton .p-button.p-highlight) {
  color: white;
}
</style>