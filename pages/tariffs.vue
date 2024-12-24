<script setup lang="ts">
import { thousandSeparator } from "~/src/shared/utils/helpers";
import { useTariffsStore } from "~/src/shared/store/tariffs";
import { useSubscriptionStore } from "~/src/shared/store/subscription";
import { formatDateToDDMMYYYY } from "~/src/shared/utils/helpers"
import {useUserStore} from "~/src/shared/store/user";

const { t } = useI18n();
const subscriptionStore = useSubscriptionStore();
const tariffsStore = useTariffsStore();
const userStore = useUserStore();

const formattedBalance = computed(() => {
  const balance = userStore?.user?.balance || 0;
  return balance.toFixed(2).replace('.', ','); // Ensures two decimal places with a comma
});

const inputBalance = ref<number>(0);

const consumeBalance = async () => {
  await userStore.consumeBalance(inputBalance.value, currencyValue.value).then((res) => {
    window.open(res, '_blank');
    inputBalance.value = 0;
  })
}

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
        value: 'kzt',
        diff: 5.5
      },
      {
        title: '$',
        value: 'usd',
        diff: 0.01
      }
    ]
)
const totalTariffTime = ref<'per_month' | 'per_year'>('per_month')

const tariffTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: t('perMonth'),
        value: 'per_month'
      },
      {
        title: t('perYear'),
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
    return basicPlans.value?.find((item) => item?.limits?.leads === basicClientCount.value)?.prices?.[`${currencyValue.value}`]?.price_per_month
  } else {
    return basicClientCountList.value?.find((item) => item.value === basicClientCount.value)?.prices?.[`${currencyValue.value}`]?.price_per_year
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
    return proPlans.value?.find((item) => item?.limits?.leads === proClientCount.value)?.prices?.[`${currencyValue.value}`]?.price_per_month
  } else {
    return proPlans.value?.find((item) => item?.limits?.leads === proClientCount.value)?.prices?.[`${currencyValue.value}`]?.price_per_year
  }
})

// const premiumClientCount = ref<string>('unlimited')
// const premiumClientCountList = ref<{ title: string; value: string; priceInMonth: number; priceInYear: number }[]>(
//     [
//       {
//         title: 'Не ограничено ∞',
//         value: 'unlimited',
//         priceInMonth: 15990,
//         priceInYear: 159900,
//       }
//     ]
// )


const totalAnalyticsTariffTime = ref<'per_month' | 'per_year'>('per_month')

const tariffAnalyticsTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: t('perMonth'),
        value: 'per_month'
      },
      {
        title: t('perYear'),
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
  console.log(analyticsPrice.value)
  if (totalAnalyticsTariffTime.value === 'per_month') {
    if (analyticsPrice.value === 'unlimited') {
      return callAnalytics.value?.find((item) => item.unlimited)?.prices?.[`${currencyValue.value}`]?.price_per_month
    }
    return callAnalytics.value?.find((item) => item.quantity === analyticsPrice.value)?.prices?.[`${currencyValue.value}`]?.price_per_month
  } else {
    if (analyticsPrice.value === 'unlimited') {
      return callAnalytics.value?.find((item) => item.unlimited)?.prices?.[`${currencyValue.value}`]?.price_per_year
    }
    return callAnalytics.value?.find((item) => item.quantity === analyticsPrice.value)?.prices?.[`${currencyValue.value}`]?.price_per_year
  }
})

const totalWhatsAppTariffTime = ref<'per_month' | 'per_year'>('per_month')

const tariffWhatsAppTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: t('perMonth'),
        value: 'per_month'
      },
      {
        title: t('perYear'),
        value: 'per_year'
      }
    ]
)

const whatsAppChannelCount = ref<number>(1)

const whatsAppChannelPrice = computed(() => {
  if (totalWhatsAppTariffTime.value === 'per_month') {
    return whatsAppChannelCount.value * services.value?.find((item) => item.type === 'whatsapp')?.prices?.[`${currencyValue.value}`]?.price_per_month
  } else {
    return whatsAppChannelCount.value * services.value?.find((item) => item.type === 'whatsapp')?.prices?.[`${currencyValue.value}`]?.price_per_year
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

const callAnalytics = computed(() => {
  return services?.value?.filter(plan => plan.name.startsWith('call_analytics'))
})


const analyticsServices = computed(() =>
    services?.value?.filter(service => service.type === 'call_analytics' && service.quantity !== 10)
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
      .slice()
      .sort((a, b) => a.limits.leads - b.limits.leads)
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
 if (subscriptions.value.length && subscriptions.value.some((plan) => plan.tariff_id !== '66eeb318ca68fc027c7a867b')) {
   showUpgradeModal.value = true
 } else {
   const planId = test?.value?.find((plan) => plan?.limits?.leads === basicClientCount.value)?._id;

   if (!planId) {
     return;
   }

   try {
     const initialResponse = await subscriptionStore.addSubscription(planId, totalTariffTime.value, currencyValue.value);

     if (initialResponse?.success) {
       window.open(initialResponse?.dataForFront?.paymentUrl, '_blank');
       return;
     }

     if (initialResponse?.error === 'User already has pending subscription, please pay to activate') {
       const cancelResponse = await subscriptionStore.cancelSubscription(initialResponse?.subscriction_id);

       if (cancelResponse?.success) {
         const retryResponse = await subscriptionStore.addSubscription(planId, totalTariffTime.value, currencyValue.value);

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
  if (subscriptions.value.length && subscriptions.value.some((plan) => plan.tariff_id !== '66eeb318ca68fc027c7a867b')) {
    showUpgradeModal.value = true
  } else {
    const planId = test?.value?.find((plan) => plan?.limits?.leads === proClientCount.value)?._id;

    if (!planId) {
      console.error('Plan ID not found.');
      return;
    }

    try {
      const initialResponse = await subscriptionStore.addSubscription(planId, totalTariffTime.value, currencyValue.value);

      if (initialResponse?.success) {
        window.open(initialResponse?.dataForFront?.paymentUrl, '_blank');
        return;
      }

      if (initialResponse?.error === 'User already has pending subscription, please pay to activate') {
        const cancelResponse = await subscriptionStore.cancelSubscription(initialResponse?.subscriction_id);

        if (cancelResponse?.success) {
          const retryResponse = await subscriptionStore.addSubscription(planId, totalTariffTime.value, currencyValue.value);

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
    await subscriptionStore.addSubscriptionService(serviceId, totalAnalyticsTariffTime.value, currencyValue.value).then(async (res) => {
      if (res?.success) {
        window.open(res?.dataForFront?.paymentUrl, '_blank');
      } else {
        await subscriptionStore.cancelSubscription(serviceId).then(async () => {
          if (res?.success) {
            await subscriptionStore.addSubscriptionService(serviceId, totalAnalyticsTariffTime.value, currencyValue.value)
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
     tariffsStore.loadUpgradableTariffs(),
     userStore.fetchUserInfo()
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
    await subscriptionStore.addSubscriptionServiceWhatsapp(serviceId, totalWhatsAppTariffTime.value, whatsAppChannelCount.value, currencyValue.value).then((res) => {
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
  return tariffsStore.getUpgradableTariffs
      ?.filter(
          (item) =>
              item._id !== '66eeb318ca68fc027c7a8677' &&
              item._id !== '66eeb318ca68fc027c7a867b'
      )
      .map((item) => {
        console.log(item);
        return {
          ...item,
          full_name: `${item.display_name} - ${item?.limits?.leads}, ${
              totalUpgradeTariffTime.value === 'per_month'
                  ? `${item?.price_per_month}`
                  : `${item?.price_per_year}`
          } Руб`,
        };
      });
});

const payUpgradeTariff = async () => {
  if (selectedUpgradeTariffId.value) {
    await subscriptionStore.upgradeTariff(selectedUpgradeTariffId.value, totalUpgradeTariffTime.value, currencyValue.value).then((res) => {
      window.open(res?.paymentUrl, '_blank');
      showUpgradeModal.value = false
    })
  }
}

const totalUpgradeTariffTime = ref<'per_month' | 'per_year'>('per_month')

const tariffUpgradeTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: t('perMonth'),
        value: 'per_month'
      },
      {
        title: t('perYear'),
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
                <Button v-if="subscriptions.some((item) => item.tariff_id !== '66eeb318ca68fc027c7a867b')" label="Обновить тариф" class="p-3 mt-auto" style="height: 30px;" @click="upgradeTariff"></Button>
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
                <span class="font-bold">{{ subscriptionCallAnalytics?.billing_cycles[0]?.usage }} {{ $t('of') }} {{ subscriptionCallAnalytics?.limit }}</span>
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
<!--                <h5 class="mb-0">Покупка 7Coin</h5>-->
<!--              </div>-->
<!--              <div class="col-12 lg:col-3">-->
<!--                <div class="h-full">-->
<!--                  <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">-->
<!--                    <div class="text-900 font-medium text-xl mb-2">7Coin</div>-->
<!--                    <hr class="my-3 mx-0 border-top-1 border-none surface-border" />-->
<!--                    <ul class="list-none p-0 m-0 flex-grow-1">-->
<!--                      <li class="flex align-items-center mb-3">-->
<!--                        <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                        <span>{{ $t('uniqueClients') }}</span>-->
<!--                      </li>-->
<!--                      <div class="mb-4">-->
<!--                        <SelectButton v-model="startClientCount" :options="startClientCountList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>-->
<!--                      </div>-->
<!--                      <li class="flex align-items-center mb-3">-->
<!--                        <i class="pi pi-check-circle text-green-500 mr-2"></i>-->
<!--                        <span>{{ $t('crmIntegrations') }}</span>-->
<!--                      </li>-->
<!--                    </ul>-->
<!--                    <span class="mb-2 font-bold text-2xl">Бесплатно</span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--            </div>-->
<!--          </BlockViewer>-->

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
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px; background: #F0F4F8 !important;">
                      <h5>{{ $t('paymentUsingTokens') }}</h5>
                      <span>{{ $t('ifYouUseYourAPI') }}</span>
                      <h5 style="margin-bottom: 0; margin-top: 4px">{{ $t('yourBalance') }}:</h5>
                      <span class="font-bold text-2xl" style="color: #076AE1">{{ formattedBalance }} руб.</span>
                      <div style="margin-top: auto">
                        <span class="mb-2">{{ $t('topUpBalance') }}</span>
                        <InputNumber style="margin-bottom: 16px; margin-top: 4px; width: 100%;" id="input-balance" min="1000" step="1000" v-model="inputBalance" fluid/>
                        <div v-if="inputBalance > 0" class="flex flex-column gap-2 mb-1">
                          <span>{{ inputBalance }} ~ {{ thousandSeparator(inputBalance * currencyList?.find((item) => item.value === 'rub' )?.diff) }} Руб</span>
                          <span>{{ inputBalance }} ~ {{ thousandSeparator(inputBalance * currencyList?.find((item) => item.value === 'kzt' )?.diff) }} Тнг</span>
                          <span>{{ inputBalance }} ~ {{ thousandSeparator(inputBalance * currencyList?.find((item) => item.value === 'usd' )?.diff) }} $</span>
                        </div>
                        <Button :label="t('pay')" class="p-3 w-full mt-auto" @click="consumeBalance"/>
                      </div>
                    </div>
                  </div>
                </div>


                <!-- Basic Plan -->
                <div class="col-12 lg:col-5">
                  <div class="h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px; background: #E3F4EA !important;">
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
                        <span>{{ $t('forPayment') }}</span>
                        <span v-if="basicTariffSum" class="font-bold text-2xl">{{ thousandSeparator(basicTariffSum) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button :label="`${subscriptions.length && subscriptions.some((item) => item.tariff_id !== '66eeb318ca68fc027c7a867b') ? `${t('updateTariff')}` : `${t('pay')}`}`" class="p-3 w-full mt-auto" @click="payBasicPlan" ></Button>
                    </div>
                  </div>
                </div>

                <!-- Pro Plan -->
                <div class="col-12 lg:col-4">
                  <div class="h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px; background: #FFE4E1 !important;">
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
                        <span>{{ $t('forPayment') }}</span>
                        <span v-if="proTariffSum" class="font-bold text-2xl">{{ thousandSeparator(proTariffSum) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button :label="`${subscriptions.length && subscriptions.some((item) => item.tariff_id !== '66eeb318ca68fc027c7a867b') ? `${t('updateTariff')}` : `${t('pay')}`}`" class="p-3 w-full mt-auto" @click="payProPlan"></Button>
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
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px; background: #DCE7FA !important;">
                      <div class="text-900 font-medium text-xl mb-2">{{ $t('numberOfCallPerMonth') }}</div>
                      <div class="mb-2 mt-2">
                        <SelectButton v-model="analyticsPrice" :options="analyticsServices" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>
                      </div>
                      <div class="text-900 font-medium mb-5">{{ $t('callAnalyticsAccess') }}</div>
                      <div class="flex flex-column gap-1 mb-4">
                        <span>{{ $t('forPayment') }}</span>
                        <span v-if="analyticsPriceSum" class="font-bold text-2xl">{{ thousandSeparator(analyticsPriceSum) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button :label="t('pay')" class="p-3 w-full mt-auto" @click="payAnalyticsService"></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BlockViewer>

          <BlockViewer header="whatsApp" free>
            <div>
              <div class="flex align-items-center mb-4 mobile">
                <h5 class="mb-0 mr-4">{{ $t('payForWhatsAppChannel') }}</h5>
                <div class="flex align-items-center gap-2">
                  <SelectButton v-model="totalWhatsAppTariffTime" :options="tariffWhatsAppTimeList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false"/>
                  <span style="color: #ef4444; font-weight: 600">-20%</span>
                </div>
              </div>
              <div class="grid">
                <div class="col-12 lg:col-3">
                  <div class="h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px; background: #A8E6C1 !important;">
                      <div class="text-900 font-medium text-xl mb-2">{{ $t('numberOfWhatsAppChannels') }}</div>
                      <InputText id="premium-channel-count" style="width: 50px" type="number" min="0" v-model="whatsAppChannelCount" />
                      <div class="flex flex-column gap-1 mt-4 mb-4">
                        <span>{{ $t('forPayment') }}</span>
                        <span v-if="whatsAppChannelPrice" class="font-bold text-2xl">{{ thousandSeparator(whatsAppChannelPrice) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button :label="t('pay')" class="p-3 w-full mt-auto" @click="payWhatsappService"></Button>
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