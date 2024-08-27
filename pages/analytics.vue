<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useAnalyticsStore } from "~/src/shared/store/analytics";

const channelStore = useChannelStore();
const analyticsStore = useAnalyticsStore();

const { t } = useI18n();
const channelStatus = ref('');
const funnelInAmoCRM = ref(null);

onMounted(async () => {
  await Promise.all([
    channelStore.getAllChannels(),
    analyticsStore.loadAnalyzers(),
  ])
})

const channels = computed(() => {
  return channelStore.getChannels
})

const isAmoExist = computed(() => {
  return channels.value.some((item) => item.type === 'amocrm')
})

const isBitrixExist = computed(() => {
  return channels.value.some((item) => item.type === 'bitrix')
})

const goToChannels = () => {
  return navigateTo({ name: 'channels' })
}
const channelType = ref('')
const channelTypes = ref([
  {
    title: 'amoCRM',
    value: 'amocrm'
  },
  {
    title: 'Bitrix24',
    value: 'bitrix24'
  }
])

const visibleModalScript = ref<boolean>(false);
const prompt = ref<string>('')
const addScript = async () => {
  await analyticsStore.addAnalyzer('Text', channelType.value, 'on').then(async (res) => {
    if (res?.success) {
      visibleModalScript.value = false;
      await analyticsStore.loadAnalyzers();
    }
  })
}

const analyzers = computed(() => {
  return analyticsStore.getAnalyzers
})

const switcher = ref(true);

const deleteAnalyzer = async (id: string) => {
  await analyticsStore.deleteAnalyzer(id).then(async (res) => {
    if (res?.success) {
      await analyticsStore.loadAnalyzers()
    }
  })
}

const saveAnalyzer = async (prompt: string, type: string, status: 'on' | 'off', id: string) => {
  await analyticsStore.editAnalyzer(prompt,type,status,id).then(async (res) => {
    if (res?.success) {
      await analyticsStore.loadAnalyzers()
    }
  })
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <h5>{{ $t('transcriptionCalls') }}</h5>
        <span>{{ $t('analyzeEmployees') }}</span>
        <div class="flex flex-column mt-5">
          <span>{{ $t('connectCRMsystem') }}</span>
          <span class="chanel-list__item align-items-center mt-2 channel-item">
            amoCRM
            <div v-if="channels.length">
              <Button v-if="!isAmoExist" :label="t('toPlug')" @click="goToChannels" />
              <span v-else style="color: #39b54a; font-size: 16px" class="font-bold">Подключен</span>
            </div>
          </span>
          <span class="chanel-list__item align-items-center mt-2 channel-item">
            Bitrix24
            <div v-if="channels.length">
              <Button v-if="!isBitrixExist" :label="t('toPlug')" @click="goToChannels" />
              <span v-else style="color: #39b54a">Подключен...</span>
            </div>
          </span>
        </div>
        <Dialog v-model:visible="visibleModalScript" modal :header="t('addScript')" :style="{ width: '50rem' }">
          <div class="flex flex-column w-full mb-2">
            <h5 class="mb-0" style="font-size: 16px">Выберите тип канала</h5>
            <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="apiKey" v-model="channelType" :options="channelTypes" optionLabel="title" option-value="value" :placeholder="t('chooseOption')"></Dropdown>
          </div>
          <div class="flex w-full justify-content-end mt-4">
            <Button label="Добавить" @click="addScript" />
          </div>
        </Dialog>
        <Button :label="t('addScript')" class="mt-4 mb-4 add-btn" @click="visibleModalScript = true" :disabled="!(isAmoExist || isBitrixExist)"/>
        <div v-if="analyzers.length" class="flex flex-column gap-6 mt-8">
          <div v-for="analyzer in analyzers" :key="analyzer._id" class="flex flex-column gap-3">
            <div class="flex gap-5 analyzer-mobile">
              <div class="flex flex-column channel-mobile">
                <h5>{{ analyzer.type === 'amocrm' ? 'amoCRM' : 'Bitrix24' }}</h5>
                <Button :label="t('updateDataCRM')"/>
                <span class="mt-4 mb-2 font-bold">{{ $t('selectEmployees') }}</span>
                <div class="flex flex-column gap-3">
                  <div class="flex justify-content-between align-items-center">
                    <div class="font-bold text-xl">Сотрудник 1</div>
                    <InputSwitch v-model="switcher" />
                  </div>
                  <div class="flex justify-content-between align-items-center">
                    <div class="font-bold text-xl">Сотрудник 1</div>
                    <InputSwitch v-model="switcher" />
                  </div>
                  <div class="flex justify-content-between align-items-center">
                    <div class="font-bold text-xl">Сотрудник 1</div>
                    <InputSwitch v-model="switcher" />
                  </div>
                  <div class="flex justify-content-between align-items-center">
                    <div class="font-bold text-xl">Сотрудник 1</div>
                    <InputSwitch v-model="switcher" />
                  </div>
                  <div class="flex justify-content-between align-items-center">
                    <div class="font-bold text-xl">Сотрудник 1</div>
                    <InputSwitch v-model="switcher" />
                  </div>
                </div>
              </div>
              <div class="flex flex-column gap-2 prompt-mobile">
                <div class="flex align-items-center justify-content-between">
                  <h5 class="mb-0" style="font-size: 16px">{{ $t('conversationAnalysis') }}</h5>
                  <a target="_blank" href="https://docs.google.com/spreadsheets/d/1u4kbwdyoU_LT0hpP99gj-vAGxo9w1ggP_Bi93GznO64/edit#gid=0" style="color: #076AE1;">({{ $t('templates') }})</a>
                </div>
                <Textarea v-model="analyzer.prompt" type="text" id="script" class="w-full" :autoResize="true" :placeholder="t('writeScript')" rows="20" cols="2" />
              </div>
            </div>
            <div class="flex align-items-center gap-4 justify-content-end">
              <i style="cursor: pointer; color: #EE9186; font-size: 18px; margin-left: auto;" class="pi pi-trash" @click="deleteAnalyzer(analyzer._id)"/>
              <Button :label="t('save')" @click="saveAnalyzer(analyzer.prompt, analyzer.type, 'on', analyzer._id)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.channel-item {
  width: 100% ;
  @media (min-width: 601px) {
    width: 50% !important;
  }
}

.add-btn {
  width: 100% ;
  @media (min-width: 601px) {
    width: 30% !important;
  }
}
.prompt-mobile {
  width: 100% ;
  @media (min-width: 601px) {
    width: 80% !important;
  }
}
.channel-mobile {
  width: 100% ;
  @media (min-width: 601px) {
    width: 40% !important;
  }
}
.analyzer-mobile {
  @media (max-width: 601px) {
    flex-direction: column;
  }
}
</style>