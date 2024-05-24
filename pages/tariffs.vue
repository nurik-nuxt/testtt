<script setup lang="ts">
const { t } = useI18n();

const myTariff = ref(49);
const maxRequest = ref(2000);
const usedRequest = ref(1399);
const tariffValidUntil = ref('19.05.2025');
const channelValidUntil = ref('19.05.2025');
const autoRenewal = ref(true)

const channelCount = ref(2)

const totalPrice = ref(50)

const basicPlanChannelCount = ref(1);
const premiumPlanChannelCount = ref(1);
const proPlanChannelCount = ref(1);

const basicPlanPrice = ref(19);
const premiumPlanPrice = ref(49);
const proPlanPrice = ref(159);

const basicPlanChannelPrice = ref(29);
const premiumPlanChannelPrice = ref(25);
const proPlanChannelPrice = ref(20);

</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <h5>{{ $t('myPlan') }}</h5>
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
            <div class="card tariff">
              <span class="font-bold">{{ $t('addChannelToTariff') }}</span>
              <span>{{ $t('textAddChannelToTariff') }}</span>
              <div class="flex gap-2 align-items-center">
                <InputText id="channel-count" style="width: 50px" type="number" min="1" v-model="channelCount" />
                <Button :label="t('buyPlan')" style="width: 150px" class="mt-auto"></Button>
              </div>
            </div>
          </div>
          <BlockViewer header="Pricing" free>
            <div>
              <h5>{{ $t('activatePlan') }}</h5>

              <div class="grid">
                <div class="col-12 lg:col-4">
                  <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">{{ $t('basicPlan') }}</div>
                      <div class="flex gap-2 align-items-center">
                        <span>{{ $t('addChannel') }}</span>
                        <InputText id="premium-channel-count" style="width: 50px" type="number" min="0" v-model="basicPlanChannelCount" />
                      </div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <div class="flex align-items-center">
                        <span class="font-bold text-2xl text-900">${{ basicPlanPrice }}</span>
                        <span class="ml-2 font-medium text-600">{{ $t('perMonth') }}</span>
                      </div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('uniqueClients') }} <span class="font-bold text-lg">500</span></span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('onlineChat') }} {{ $t('freePlan') }}</span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('anyChannel') }} <span class="font-bold text-lg">${{ basicPlanChannelPrice }}</span></span>
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
                          <i class="pi pi-minus-circle mr-2" style="color: #C1C1C1"></i>
                          <span>{{ $t('callAnalytics') }}</span>
                        </li>
                      </ul>
                      <span class="mb-2 font-bold text-2xl">{{ $t('total') }}: {{ basicPlanChannelCount * basicPlanChannelPrice + basicPlanPrice }}$ {{ $t('perMonth') }}</span>
                      <hr class="mb-3 mx-0 border-top-1 border-none surface-border mt-auto" />
                      <Button :label="t('buyPlan')" class="p-3 w-full mt-auto"></Button>
                    </div>
                  </div>
                </div>

                <div class="col-12 lg:col-4">
                  <div class="p-3 h-full">
                    <div class="shadow-2 p-3 h-full flex flex-column surface-card" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">{{ $t('premiumPlan') }}</div>
                      <div class="flex gap-2 align-items-center">
                        <span>{{ $t('addChannel') }}</span>
                        <InputText id="premium-channel-count" style="width: 50px" type="number" min="0" v-model="premiumPlanChannelCount" />
                      </div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <div class="flex align-items-center">
                        <span class="font-bold text-2xl text-900">${{ premiumPlanPrice }}</span>
                        <span class="ml-2 font-medium text-600">{{ $t('perMonth') }}</span>
                      </div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('uniqueClients') }} <span class="font-bold text-lg">2000</span></span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('onlineChat') }} {{ $t('freePlan') }}</span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('anyChannel') }} <span class="font-bold	text-lg">${{ premiumPlanChannelPrice }}</span></span>
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
                          <span>{{ $t('callAnalytics') }}</span>
                        </li>
                      </ul>
                      <span class="mb-2 font-bold text-2xl">{{ $t('total') }}: {{ premiumPlanChannelCount * premiumPlanChannelPrice + premiumPlanPrice }}$ {{ $t('perMonth') }}</span>
                      <hr class="mb-3 mx-0 border-top-1 border-none surface-border" />
                      <Button :label="t('buyPlan')" class="p-3 w-full"></Button>
                    </div>
                  </div>
                </div>

                <div class="col-12 lg:col-4">
                  <div class="p-3 h-full">
                    <div class="shadow-2 p-3 flex flex-column surface-card" style="border-radius: 6px">
                      <div class="text-900 font-medium text-xl mb-2">{{ $t('proPlan') }}</div>
                      <div class="flex gap-2 align-items-center">
                        <span>{{ $t('addChannel') }}</span>
                        <InputText id="premium-channel-count" style="width: 50px" type="number" min="0" v-model="proPlanChannelCount" />
                      </div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <div class="flex align-items-center">
                        <span class="font-bold text-2xl text-900">${{ proPlanPrice }}</span>
                        <span class="ml-2 font-medium text-600">{{ $t('perMonth') }}</span>
                      </div>
                      <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                      <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('uniqueClients') }} <span class="font-bold text-lg">{{ $t('unlimitedPlan') }}</span></span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('onlineChat') }} {{ $t('freePlan') }}</span>
                        </li>
                        <li class="flex align-items-center mb-3">
                          <i class="pi pi-check-circle text-green-500 mr-2"></i>
                          <span>{{ $t('anyChannel') }} <span class="font-bold text-lg">${{ proPlanChannelPrice}}</span></span>
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
                          <span>{{ $t('callAnalytics') }}</span>
                        </li>
                      </ul>
                      <span class="mb-2 font-bold text-2xl">{{ $t('total') }}: {{ proPlanChannelCount * proPlanChannelPrice + proPlanPrice }}$ {{ $t('perMonth') }}</span>
                      <hr class="mb-3 mx-0 border-top-1 border-none surface-border" />
                      <Button :label="t('buyPlan')" class="p-3 w-full"></Button>
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