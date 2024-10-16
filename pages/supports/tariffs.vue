<script setup lang="ts">
import { thousandSeparator } from "~/src/shared/utils/helpers";
import { useTariffsStore } from "~/src/shared/store/tariffs";
import { useSubscriptionStore } from "~/src/shared/store/subscription";
import { formatDateToDDMMYYYY } from "~/src/shared/utils/helpers"

const { t } = useI18n();
const subscriptionStore = useSubscriptionStore();
const tariffsStore = useTariffsStore();
const autoRenewal = ref(true)

onMounted(async () => {
  await tariffsStore.loadTariffs();
  await tariffsStore.loadUpgradableTariffs()
})

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


const test = computed(() => {
  return tariffsStore.getTariffs
})

const services = computed(() => {
  return tariffsStore.getServices
})

const basicPlans = computed(() => {
  return test?.value?.filter(plan => plan.name.startsWith('base'));
});

const proPlans = computed(() => {
  return test?.value?.filter(plan => plan.name.startsWith('pro'))
})



const analyticsServices = computed(() =>
    services?.value?.filter(service => service.type === 'call_analytics')
        .map(service => ({
          id: service._id,
          title: service.unlimited ? '∞' : service.quantity,
          value: service.unlimited ? 'unlimited' : service.quantity,
          priceInMonth: service.price_per_month,
          priceInYear: service.price_per_year,
        }))
);

const basicClientOptions = computed(() => {
  return basicPlans.value
      .slice() // Create a shallow copy of the array to avoid mutating the original array
      .sort((a, b) => a.limits.leads - b.limits.leads) // Sort by `limits.leads` in ascending order
      .map(plan => ({
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
  if (subscriptions.value.length) {
    showUpgradeModal.value = true
  } else {
    const planId = test?.value?.find((plan) => plan?.limits?.leads === basicClientCount.value)?._id;

    if (!planId) {
      return;
    }

    try {
      const initialResponse = await subscriptionStore.addSubscription(planId, totalTariffTime.value);

      if (initialResponse?.success) {
        window.open(initialResponse?.dataForFront?.paymentUrl, '_blank');
        return;
      }

      if (initialResponse?.error === 'User already has pending subscription, please pay to activate') {
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
  }
};
const payProPlan = async () => {
  if (subscriptions.value.length) {
    showUpgradeModal.value = true
  } else {
    const planId = test?.value?.find((plan) => plan?.limits?.leads === proClientCount.value)?._id;

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

      if (initialResponse?.error === 'User already has pending subscription, please pay to activate') {
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
  }
}

const payAnalyticsService = async () => {
  const serviceId = services?.value?.find(
      (service) =>
          service.quantity === analyticsPrice.value ||
          (analyticsPrice.value === 'unlimited' && service.unlimited)
  )?._id;
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
  await Promise.all([
    subscriptionStore.loadSubscriptionsTariff(),
    subscriptionStore.loadSubscriptionsService(),
    subscriptionStore.loadSubscriptionsWhatsapp(),
    tariffsStore.loadTariffs(),
    tariffsStore.loadUpgradableTariffs()
  ])
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
  const serviceId = services?.value?.find((service) => service.type === 'whatsapp')?._id;
  if (serviceId) {
    await subscriptionStore.addSubscriptionServiceWhatsapp(serviceId, totalWhatsAppTariffTime.value, whatsAppChannelCount.value).then((res) => {
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


const upgradedTariffs = computed(() => {
  return tariffsStore.getUpgradableTariffs?.map((item) => {
    return {
      ... item,
      full_name: `${item.display_name} - ${item?.limits?.leads}, ${totalUpgradeTariffTime.value === 'per_month' ? `${item?.upgrade_prices?.difference_month_price}` : `${item?.upgrade_prices?.difference_year_price}`} Руб`
    }
  })
});
const payUpgradeTariff = async () => {
  if (selectedUpgradeTariffId.value) {
    await subscriptionStore.upgradeTariff(selectedUpgradeTariffId.value, totalUpgradeTariffTime.value).then((res) => {
      window.open(res?.paymentUrl, '_blank');
      showUpgradeModal.value = false
    })
  }
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
        option-value="_id"
        option-label="full_name"
    >
      <template #option="slotProps">
        <div class="flex justify-content-between align-items-center w-full">
          <span>{{ slotProps.option.display_name }} - {{ slotProps.option.limits.leads }}</span>
          <span class="font-bold" style="color: #10b981">
            +
        {{ totalUpgradeTariffTime === 'per_month'
              ? thousandSeparator(slotProps.option?.upgrade_prices.difference_month_price * currencyList?.find((item) => item.value === currencyValue)?.diff)
              : thousandSeparator(slotProps.option?.upgrade_prices?.difference_year_price * currencyList?.find((item) => item.value === currencyValue)?.diff) }}
        {{ currencyList?.find((item) => item.value === currencyValue)?.title }}
      </span>
        </div>
      </template>

      <template #item="slotProps">
        <div class="flex justify-content-between align-items-center w-full">
          <span>{{ slotProps.option.display_name }} - {{ slotProps.option.limits.leads }}</span>
          <span class="font-bold" style="color: #10b981">
            +
        {{ totalUpgradeTariffTime === 'per_month'
              ? thousandSeparator(slotProps.option?.upgrade_prices.difference_month_price * currencyList?.find((item) => item.value === currencyValue)?.diff)
              : thousandSeparator(slotProps.option?.upgrade_prices?.difference_year_price * currencyList?.find((item) => item.value === currencyValue)?.diff) }}
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
                <span class="font-bold">{{ test?.find((item) => item._id === subscriptions?.find((subscription) => subscription.type === 'tariff'  && subscription.status === 'active')?.tariff_id)?.display_name}} {{ test?.find((item) => item._id === subscriptions?.find((subscription) => subscription.type === 'tariff'  && subscription.status === 'active')?.tariff_id)?.limits?.leads}}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('used') }}:</span>
                <span class="font-bold">{{ subscriptions?.find((subscription) => subscription.type === 'tariff'  && subscription.status === 'active')?.billing_cycles[0]?.usage }} {{ $t('of') }} {{ subscriptions?.find((subscription) => subscription.type === 'tariff'  && subscription.status === 'active')?.billing_cycles[0]?.limit }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('validUntil') }}:</span>
                <span class="font-bold">{{ formatDateToDDMMYYYY(subscriptions?.find((subscription) => subscription.type === 'tariff'  && subscription.status === 'active')?.end_date) }}</span>
              </div>
              <div class="flex flex-column gap-2">
<!--                <Button label="Обновить тариф" class="p-3 mt-auto" style="height: 30px;" @click="upgradeTariff"></Button>-->
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
<!--          <BlockViewer header="Pricing" free>-->
<!--            <div>-->
<!--              <div class="flex align-items-center mb-4 gap-4 mobile">-->
<!--                <h5 class="mb-0">{{ $t('activatePlan') }}</h5>-->
<!--                <div class="flex align-items-center gap-2">-->
<!--                  <SelectButton v-model="totalTariffTime" :options="tariffTimeList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false" />-->
<!--                  <span class="ml-2 mobile-dis" style="color: #ef4444; font-weight: 600">-20%</span>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="grid">-->
<!--                &lt;!&ndash; Start Plan &ndash;&gt;-->
<!--                <div class="col-12 lg:col-3">-->
<!--                  <div class="h-full">-->
<!--                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">-->
<!--                      <div class="text-900 font-medium text-xl mb-2">Start</div>-->
<!--                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />-->
<!--                      <ul class="list-none p-0 m-0 flex-grow-1">-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('uniqueClients') }}</span>-->
<!--                        </li>-->
<!--                        <div class="mb-4">-->
<!--                          <SelectButton v-model="startClientCount" :options="startClientCountList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>-->
<!--                        </div>-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('crmIntegrations') }}</span>-->
<!--                        </li>-->
<!--                      </ul>-->
<!--                      <span class="mb-2 font-bold text-2xl">Бесплатно</span>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash;                <pre>{{ subscriptions }}</pre>&ndash;&gt;-->

<!--                &lt;!&ndash; Basic Plan &ndash;&gt;-->
<!--                <div class="col-12 lg:col-5">-->
<!--                  <div class="h-full">-->
<!--                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">-->
<!--                      <div class="text-900 font-medium text-xl mb-2">Base</div>-->
<!--                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />-->
<!--                      <ul class="list-none p-0 m-0 flex-grow-1">-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('uniqueClients') }}</span>-->
<!--                        </li>-->
<!--                        <div class="mb-4">-->
<!--                          <SelectButton v-model="basicClientCount" :options="basicClientOptions" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>-->
<!--                        </div>-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('onlineChat') }} {{ $t('freePlan') }}</span>-->
<!--                        </li>-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('crmIntegrations') }}</span>-->
<!--                        </li>-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('supportTarif247') }}</span>-->
<!--                        </li>-->
<!--                      </ul>-->
<!--                      <div class="flex flex-column gap-1 mb-4">-->
<!--                        <span>К оплате</span>-->
<!--                        <span class="font-bold text-2xl">{{ thousandSeparator(basicTariffSum * currencyList?.find((item) => item.value === currencyValue)?.diff) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>-->
<!--                      </div>-->
<!--                      <Button :label="`${subscriptions.length ? 'Обновить тариф' : 'Оплатит'}`" class="p-3 w-full mt-auto" @click="payBasicPlan" ></Button>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; Pro Plan &ndash;&gt;-->
<!--                <div class="col-12 lg:col-4">-->
<!--                  <div class="h-full">-->
<!--                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px; background-color: #e7f9e7;">-->
<!--                      <div class="text-900 font-medium text-xl mb-2">Pro</div>-->
<!--                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />-->
<!--                      <ul class="list-none p-0 m-0 flex-grow-1">-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('uniqueClients') }}</span>-->
<!--                        </li>-->
<!--                        <div class="mb-4">-->
<!--                          <SelectButton v-model="proClientCount" :options="proClientOptions" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>-->
<!--                        </div>-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('onlineChat') }} {{ $t('freePlan') }}</span>-->
<!--                        </li>-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('crmIntegrations') }}</span>-->
<!--                        </li>-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('supportTarif247') }}</span>-->
<!--                        </li>-->
<!--                        <li class="flex align-items-center mb-3">-->
<!--                          <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                          <span>{{ $t('callAnalytics') }}<span style="font-weight: 700; margin-left: 5px">100 звонков</span></span>-->
<!--                        </li>-->
<!--                      </ul>-->
<!--                      <div class="flex flex-column gap-1 mb-4">-->
<!--                        <span>К оплате</span>-->
<!--                        <span class="font-bold text-2xl">{{ thousandSeparator(proTariffSum * currencyList?.find((item) => item.value === currencyValue)?.diff) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>-->
<!--                      </div>-->
<!--                      <Button :label="`${subscriptions.length ? 'Обновить тариф' : 'Оплатит'}`" class="p-3 w-full mt-auto" @click="payProPlan"></Button>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->

<!--              </div>-->
<!--            </div>-->
<!--          </BlockViewer>-->

<!--          <BlockViewer header="analytics" free>-->
<!--            <div>-->
<!--              <div class="flex align-items-center mb-4 gap-4 mobile">-->
<!--                <h5 class="mb-0">{{ $t('callAnalytics') }}</h5>-->
<!--                <div class="flex align-items-center gap-2">-->
<!--                  <SelectButton v-model="totalAnalyticsTariffTime" :options="tariffAnalyticsTimeList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>-->
<!--                  <span class="ml-2" style="color: #ef4444; font-weight: 600">-20%</span>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="grid">-->
<!--                <div class="col-12 lg:col-4">-->
<!--                  <div class="h-full">-->
<!--                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">-->
<!--                      <div class="text-900 font-medium text-xl mb-2">Количество звонков в мес.</div>-->
<!--                      <div class="mb-2 mt-2">-->
<!--                        <SelectButton v-model="analyticsPrice" :options="analyticsServices" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>-->
<!--                      </div>-->
<!--                      <div class="text-900 font-medium mb-5">Доступно только для amoCRM и Bitrix24</div>-->
<!--                      <div class="flex flex-column gap-1 mb-4">-->
<!--                        <span>К оплате</span>-->
<!--                        <span class="font-bold text-2xl">{{ thousandSeparator(analyticsPriceSum * currencyList?.find((item) => item.value === currencyValue)?.diff) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>-->
<!--                      </div>-->
<!--                      <Button label="Оплатить" class="p-3 w-full mt-auto" @click="payAnalyticsService"></Button>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </BlockViewer>-->

<!--          <BlockViewer header="whatsApp" free>-->
<!--            <div>-->
<!--              <div class="flex align-items-center mb-4 mobile">-->
<!--                <h5 class="mb-0 mr-4">Оплатить канал WhatsApp</h5>-->
<!--                <div class="flex align-items-center gap-2">-->
<!--                  <SelectButton v-model="totalWhatsAppTariffTime" :options="tariffWhatsAppTimeList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>-->
<!--                  <span style="color: #ef4444; font-weight: 600">-20%</span>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="grid">-->
<!--                <div class="col-12 lg:col-3">-->
<!--                  <div class="h-full">-->
<!--                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">-->
<!--                      <div class="text-900 font-medium text-xl mb-2">Количество каналов WhatsApp</div>-->
<!--                      <InputText id="premium-channel-count" style="width: 50px" type="number" min="0" v-model="whatsAppChannelCount" />-->
<!--                      <div class="flex flex-column gap-1 mt-4 mb-4">-->
<!--                        <span>К оплате</span>-->
<!--                        <span class="font-bold text-2xl">{{ thousandSeparator(whatsAppChannelPrice * currencyList?.find((item) => item.value === currencyValue)?.diff) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>-->
<!--                      </div>-->
<!--                      <Button label="Оплатить" class="p-3 w-full mt-auto" @click="payWhatsappService"></Button>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </BlockViewer>-->
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
