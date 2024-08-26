<script setup lang="ts">
import { thousandSeparator } from "~/src/shared/utils/helpers";

const { t } = useI18n();

const myTariff = ref(49);
const maxRequest = ref(2000);
const usedRequest = ref(1399);
const tariffValidUntil = ref('19.05.2025');
const channelValidUntil = ref('19.05.2025');
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
const totalTariffTime = ref<string>('month')

const tariffTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: 'в мес',
        value: 'month'
      },
      {
        title: 'в год',
        value: 'year'
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
      }
    ]
)

const basicTariffSum = computed(() => {
  if (totalTariffTime.value === 'month') {
    return basicClientCountList.value?.find((item) => item.value === basicClientCount.value)?.priceInMonth
  } else {
    return basicClientCountList.value?.find((item) => item.value === basicClientCount.value)?.priceInYear
  }
})
const proClientCount = ref<number>(2000)
const proClientCountList = ref<{ title: string; value: number; priceInMonth: number; priceInYear: number }[]>(
    [
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
const proTariffSum = computed(() => {
  if (totalTariffTime.value === 'month') {
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

const premiumTariffSum = computed(() => {
  if (totalTariffTime.value === 'month') {
    return premiumClientCountList.value?.find((item) => item.value === premiumClientCount.value)?.priceInMonth
  } else {
    return premiumClientCountList.value?.find((item) => item.value === premiumClientCount.value)?.priceInYear
  }
})

const totalAnalyticsTariffTime = ref<string>('month')

const tariffAnalyticsTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: 'в мес',
        value: 'month'
      },
      {
        title: 'в год',
        value: 'year'
      }
    ]
)
const analyticsPrice = ref(500)
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
  if (totalAnalyticsTariffTime.value === 'month') {
    return analyticsPriceList.value?.find((item) => item.value === analyticsPrice.value)?.priceInMonth
  } else {
    return analyticsPriceList.value?.find((item) => item.value === analyticsPrice.value)?.priceInYear
  }
})

const totalWhatsAppTariffTime = ref<string>('month')

const tariffWhatsAppTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: 'в мес',
        value: 'month'
      },
      {
        title: 'в год',
        value: 'year'
      }
    ]
)

const whatsAppChannelCount = ref<number>(1)

const whatsAppChannelPrice = computed(() => {
  if (totalWhatsAppTariffTime.value === 'month') {
    return whatsAppChannelCount.value * 1990
  } else {
    return whatsAppChannelCount.value * 19900
  }
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <div class="flex justify-content-between items-center mb-4">
          <h5>{{ $t('myPlan') }}</h5>
          <SelectButton v-model="currencyValue" :options="currencyList" aria-labelledby="basic" option-label="title" option-value="value" />
        </div>
        <div class="flex flex-column gap-8">
          <div class="flex md:flex-row flex-column align-items-center gap-5">
            <div class="tariff-card">
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('currentPlan') }}:</span>
                <span class="font-bold">{{ $t('premiumPlan')}} {{ myTariff }}$</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('used') }}:</span>
                <span class="font-bold">{{ usedRequest }} {{ $t('of') }} {{ maxRequest }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('validUntil') }}:</span>
                <span class="font-bold">{{ tariffValidUntil }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('autoRenewal') }}:</span>
                <span class="flex align-items-center font-bold">
                  {{ $t('switch') }}
                  <InputSwitch v-model="autoRenewal" style="margin-left: 8px"/></span>
              </div>
            </div>
            <div class="tariff-card">
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('connectedChannels') }}:</span>
                <span class="font-bold">{{ channelCount }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('validUntil') }}:</span>
                <span class="font-bold">{{ channelValidUntil }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <span>{{ $t('totalPerMonth') }}:</span>
                <span class="font-bold">{{ totalPrice }} $</span>
              </div>
            </div>

          </div>
          <BlockViewer header="Pricing" free>
            <div>
              <div class="flex align-items-center mb-4">
                <h5 class="mb-0 mr-4">{{ $t('activatePlan') }}</h5>
                <SelectButton v-model="totalTariffTime" :options="tariffTimeList" aria-labelledby="basic" option-label="title" option-value="value" />
                <span class="ml-2" style="color: #ef4444; font-weight: 600">-16%</span>
              </div>
              <div class="grid">
                <!-- Start Plan -->
                <div class="col-12 lg:col-3">
                  <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">Старт</div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('uniqueClients') }} <span style="font-weight: 700; margin-left: 5px">20</span></span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('crmIntegrations') }}</span>
                        </li>
                      </ul>
                      <span class="mb-2 font-bold text-2xl">Бесплатно</span>
                    </div>
                  </div>
                </div>

                <!-- Basic Plan -->
                <div class="col-12 lg:col-3">
                  <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">{{ $t('basicPlan') }}</div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('uniqueClients') }}</span>
                        </li>
                        <div class="mb-4">
                          <SelectButton v-model="basicClientCount" :options="basicClientCountList" aria-labelledby="basic" option-label="title" option-value="value" />
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
                      <Button label="Оплатить" class="p-3 w-full mt-auto"></Button>
                    </div>
                  </div>
                </div>

                <!-- Pro Plan -->
                <div class="col-12 lg:col-3">
                  <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px; background-color: #e7f9e7;">
                      <div class="text-900 font-medium text-xl mb-2">{{ $t('proPlan') }}</div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('uniqueClients') }}</span>
                        </li>
                        <div class="mb-4">
                          <SelectButton v-model="proClientCount" :options="proClientCountList" aria-labelledby="basic" option-label="title" option-value="value" />
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
                      <Button label="Оплатить" class="p-3 w-full mt-auto"></Button>
                    </div>
                  </div>
                </div>

                <!-- Premium Plan -->
                <div class="col-12 lg:col-3">
                  <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">{{ $t('premiumPlan') }}</div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('uniqueClients') }}</span>
                        </li>
                        <div class="mb-4">
                          <SelectButton v-model="premiumClientCount" :options="premiumClientCountList" aria-labelledby="basic" option-label="title" option-value="value" />
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
                          <span>{{ $t('callAnalytics') }}<span style="font-weight: 700; margin-left: 5px">∞</span></span>
                        </li>
                      </ul>
                      <div class="flex flex-column gap-1 mb-4">
                        <span>К оплате</span>
                        <span class="font-bold text-2xl">{{ thousandSeparator(premiumTariffSum * currencyList?.find((item) => item.value === currencyValue)?.diff) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button label="Оплатить" class="p-3 w-full mt-auto"></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BlockViewer>

          <BlockViewer header="analytics" free>
            <div>
              <div class="flex align-items-center mb-4">
                <h5 class="mb-0 mr-4">{{ $t('callAnalytics') }}</h5>
                <SelectButton v-model="totalAnalyticsTariffTime" :options="tariffAnalyticsTimeList" aria-labelledby="basic" option-label="title" option-value="value" />
                <span class="ml-2" style="color: #ef4444; font-weight: 600">-16%</span>
              </div>
              <div class="grid">
                <div class="col-12 lg:col-3">
                  <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">Количество звонков в мес.</div>
                      <div class="mb-2 mt-2">
                        <SelectButton v-model="analyticsPrice" :options="analyticsPriceList" aria-labelledby="basic" option-label="title" option-value="value" />
                      </div>
                      <div class="text-900 font-medium mb-5">Доступно только для amoCRM и Bitrix24</div>
                      <div class="flex flex-column gap-1 mb-4">
                        <span>К оплате</span>
                        <span class="font-bold text-2xl">{{ thousandSeparator(analyticsPriceSum * currencyList?.find((item) => item.value === currencyValue)?.diff) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button label="Оплатить" class="p-3 w-full mt-auto"></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BlockViewer>

          <BlockViewer header="whatsApp" free>
            <div>
              <div class="flex align-items-center mb-4">
                <h5 class="mb-0 mr-4">Оплатить канал WhatsApp</h5>
                <SelectButton v-model="totalWhatsAppTariffTime" :options="tariffWhatsAppTimeList" aria-labelledby="basic" option-label="title" option-value="value" />
                <span class="ml-2" style="color: #ef4444; font-weight: 600">-16%</span>
              </div>
              <div class="grid">
                <div class="col-12 lg:col-3">
                  <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card cursor-pointer" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">Количество каналов WhatsApp</div>
                      <InputText id="premium-channel-count" style="width: 50px" type="number" min="0" v-model="whatsAppChannelCount" />
                      <div class="flex flex-column gap-1 mt-4 mb-4">
                        <span>К оплате</span>
                        <span class="font-bold text-2xl">{{ thousandSeparator(whatsAppChannelPrice) }} <span>{{ currencyList?.find((item) => item.value === currencyValue)?.title }}</span></span>
                      </div>
                      <Button label="Оплатить" class="p-3 w-full mt-auto"></Button>
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
