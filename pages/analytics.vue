<script setup lang="ts">
const { t } = useI18n();
const channelStatus = ref('');
const funnelInAmoCRM = ref(null);
const callSource = ref(null)
const mondayActive = ref(true);
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
const callSources = ref([
  {
    id: 1,
    title: 'KCell IP telefonia'
  },
  {
    id: 2,
    title: 'KCell IP telefonia'
  },
  {
    id: 3,
    title: 'KCell IP telefonia'
  }
])
const messages = ref<{ id: number }[]>([]);
const addMessage = () => {
  messages.value.push({ id: messages.value.length + 1})
}
const deleteMessage = (id: number) => {
  messages.value = messages.value.filter(message => message.id !== id);
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
          <span class="chanel-list__item align-items-center mt-2" style="width: 50%">
            amoCRM
            <Button :label="t('toPlug')" />
          </span>
          <span class="chanel-list__item align-items-center mt-2" style="width: 50%">
            Bitrix24
            <Button :label="t('toPlug')" />
          </span>
        </div>
        <div v-if="messages?.length">
          <div v-for="(message) in messages" :key="message.id" class="flex flex-column mt-5">
            <h5 class="mt-4">AmoCRM</h5>
            <div class="flex w-full gap-8">
              <div class="flex flex-column gap-4" style="width: 50%">
                <Button :label="t('disableAmoCRM')" severity="danger"></Button>
                <div class="flex gap-3 align-items-center">
                  <div>{{ $t('channelStatus') }}</div>
                  <div class="flex flex-wrap gap-3">
                    <div class="flex align-items-center">
                      <RadioButton v-model="channelStatus" inputId="included" name="included" value="included" />
                      <label for="ingredient1" class="ml-2">{{ $t('included') }}</label>
                    </div>
                    <div class="flex align-items-center">
                      <RadioButton v-model="channelStatus" inputId="switchedOff" name="switchedOff" value="switchedOff" />
                      <label for="ingredient2" class="ml-2">{{ $t('switchedOff') }}</label>
                    </div>
                  </div>
                </div>
                <div class="flex flex-column">
                  <span>{{ $t('funnelInAmoCRM') }}</span>
                  <Dropdown style="margin-top: 8px" id="funnelsInAmoCRM" v-model="funnelInAmoCRM" :options="funnelsInAmoCRM" optionLabel="title" :placeholder="t('chooseOption')"></Dropdown>
                </div>
                <div class="flex flex-column gap-2">
                  <span>{{ $t('stageAmo') }}</span>
                  <div class="flex align-items-center justify-content-between" v-for="(amoStatus, index) in amoStatuses" :key="index">
                    <span>{{ amoStatus.title }}</span>
                    <InputSwitch v-model="mondayActive" style="margin-left: 8px"/>
                  </div>
                </div>
                <div class="flex flex-column">
                  <span>{{ $t('selectCallSource') }}</span>
                  <Dropdown style="margin-top: 8px" id="funnelsInAmoCRM" v-model="callSource" :options="callSources" optionLabel="title" :placeholder="t('chooseOption')"></Dropdown>
                </div>
              </div>
              <div class="flex flex-column gap-2 w-full">
                <div class="flex align-items-center justify-content-between">
                  <h5 class="mb-0">{{ $t('conversationAnalysis') }}</h5>
                  <a target="_blank" href="https://docs.google.com/spreadsheets/d/1u4kbwdyoU_LT0hpP99gj-vAGxo9w1ggP_Bi93GznO64/edit#gid=0" style="color: #076AE1;">({{ $t('templates') }})</a>
                </div>
                <Textarea type="text" id="script" class="w-full" :autoResize="true" :placeholder="t('writeScript')" rows="20" cols="2" />
                <i style="cursor: pointer; color: #EE9186; font-size: 24px; margin-left: auto; margin-top: 8px" class="pi pi-trash" @click="deleteMessage(message.id)"/>
              </div>
            </div>
          </div>
        </div>
        <Button :label="t('addScript')" style="width: 30%" class="mt-4" @click="addMessage"/>
        <div class="mt-3 flex align-items-center justify-content-end">
          <Button style="color: #334155" :label="t('goBack')" link />
          <Button :label="t('save')" />
        </div>
      </div>
    </div>
  </div>
</template>