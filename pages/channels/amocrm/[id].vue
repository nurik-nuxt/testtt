<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useAmoCrmStore } from "~/src/shared/store/amocrm";

const channelStore = useChannelStore();
const amoCrmStore = useAmoCrmStore();

const route = useRoute();
const channelStatus = ref('');
const { t } = useI18n();
const funnelInAmoCRM = ref(null);
const mondayActive = ref(true);
const voronkas = ref([])
const funnelsInAmoCRM = ref([
  {
    id: 1,
    title: 'Воронка AMO 1'
  },
  {
    id: 2,
    title: 'Воронка AMO 2'
  },
  {
    id: 3,
    title: 'Воронка AMO 3'
  },
  {
    id: 4,
    title: 'Воронка AMO 4'
  },
  {
    id: 5,
    title: 'Воронка AMO 5'
  }
])
const amoStatuses = ref([
  {
    id: 1,
    title: 'Неразобранное',
    active: true
  },
  {
    id: 2,
    title: 'GPT',
    active: true
  },
  {
    id: 3,
    title: 'Отправил ссылку',
    active: true
  },
  {
    id: 4,
    title: 'Телефон',
    active: true
  },
  {
    id: 5,
    title: 'Заполнил анкету',
    active: true
  },
  {
    id: 6,
    title: 'Оплатил мини курс',
    active: true
  },
  {
    id: 7,
    title: 'Созвон + КП',
    active: true
  }
])

const fetchChannel = async () => {
  await channelStore.getChannelById(<string>route.params.id).then((res) => {
    channelStatus.value = res.status
  })
}

const fetchVoronki = async () => {
  await amoCrmStore.fetchVoronki().then((res) => {
    console.log(res);
    voronkas.value = res;
  });
}

const changeChannelStatus = async (status: string) => {
  await channelStore.changeStatusChannelById(<string>route.params.id, status).then((res) => {
    if (res.success) {
      fetchChannel();
    }
  })
}

onMounted(() => {
  fetchChannel();
  fetchVoronki();
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="font-bold">AmoCRM</h5>
        <div class="flex w-full gap-8">
          <div class="flex flex-column gap-4">
            <Button v-if="channelStatus === 'active'" :label="t('disableAmoCRM')" severity="danger" @click="changeChannelStatus('off')"></Button>
            <Button v-else :label="t('connectAmoCRM')" @click="changeChannelStatus('active')"></Button>
            <div class="flex gap-3 align-items-center">
              <div>{{ $t('channelStatus') }}</div>
              <div class="flex flex-wrap gap-3">
                <div class="flex align-items-center">
                  <RadioButton v-model="channelStatus" inputId="active" name="active" value="active" />
                  <label for="active" class="ml-2">{{ $t('included') }}</label>
                </div>
                <div class="flex align-items-center">
                  <RadioButton v-model="channelStatus" inputId="off" name="off" value="off" />
                  <label for="off" class="ml-2">{{ $t('switchedOff') }}</label>
                </div>
              </div>
            </div>
            <div class="flex flex-column">
              <span>{{ $t('funnelInAmoCRM') }}</span>
              <Dropdown style="margin-top: 8px" id="funnelsInAmoCRM" v-model="funnelInAmoCRM" :options="voronkas" optionLabel="name" option-value="id" :placeholder="t('chooseOption')"></Dropdown>
            </div>
            <div class="flex flex-column gap-2">
              <span class="font-bold">{{ $t('stageAmo') }}:</span>
              <div class="flex align-items-center justify-content-between" v-for="(amoStatus, index) in amoStatuses" :key="index">
                <span>{{ amoStatus.title }}</span>
                <InputSwitch v-model="mondayActive" style="margin-left: 8px"/>
              </div>
            </div>
          </div>
          <div class="flex flex-column gap-4">
            <h5>{{ $t('instructionsConnectAmoCRM') }}</h5>
            <span>{{ $t('instructionText') }}</span>
          </div>
        </div>
        <div class="mt-5 flex gap-4 align-items-center justify-content-end">
          <nuxt-link to="/chatbots" style="color: #334155">{{ $t('goBack')}}</nuxt-link>
          <Button :label="t('save')"></Button>
        </div>
      </div>
    </div>
  </div>
</template>