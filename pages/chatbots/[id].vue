<script setup lang="ts">

interface BotItem {
  title: string;
  id: number;
  channels: string[];
  isActive: boolean
}

const route = useRoute();
const bots = ref<BotItem[]>([
  {
    title: 'Bot 1',
    id: 123454,
    channels: ['instagram', 'whatsapp', 'telegram'],
    isActive: true
  },
  {
    title: 'Bot 1',
    id: 123454,
    channels: ['instagram', 'whatsapp', 'telegram'],
    isActive: true
  },
  {
    title: 'Bot 2',
    id: 3434,
    channels: ['instagram', 'whatsapp', 'telegram'],
    isActive: true
  },
  {
    title: 'Bot 3',
    id: 6556,
    channels: ['instagram', 'whatsapp', 'telegram'],
    isActive: true
  },
  {
    title: 'Bot 4',
    id: 12334545454,
    channels: ['whatsapp', 'telegram'],
    isActive: true
  },
  {
    title: 'Bot 5',
    id: 656534,
    channels: ['instagram', 'whatsapp', 'telegram'],
    isActive: true
  },
  {
    title: 'Bot 6',
    id: 34345,
    channels: ['instagram', 'whatsapp', 'telegram'],
    isActive: true
  }
])
const switchValue = ref<boolean>(false);
const extra = ref<boolean>(false);

const apiKeyTypes = ref([
  {
    title: 'Использовать отдельный токен для этого бота',
    code: 'individual_token'
  },
  {
    title: 'Использовать токен 7s',
    code: '7s_token'
  }
]);

const models = ref([
  {
    title: 'ChatGPT 3.5 turbo 16k',
    code: 'chat_gpt_16k'
  },
  {
    title: 'ChatGPT 3.5 turbo 0125',
    code: 'chat_gpt_0125'
  },
  {
    title: 'ChatGPT 4 turbo',
    code: 'chat_gpt_4'
  },
  {
    title: 'Giminy',
    code: 'giminy'
  },
])

const limitDays = computed(() => {
  return [
    {
      title: t('perDay'),
      id: 'perDay'
    },
    {
      title: t('perHour'),
      id: 'perHour'
    }
  ]
})
const apiKey = ref(null);
const model = ref(null);
const limitDay = ref(null);

const createKnowledgeBase = (id: number) => {
  return navigateTo({ name: 'chatbots-knowledge-id', params: { id: id }})
}

const knowledgeBaseList = ref([
  {
    key: 'knowledgeBase1',
    data: {
      label: 'База Знаний 1',
    }
  },
  {
    key: 'knowledgeBase2',
    data: {
      label: 'База Знаний 2',
    }
  },
  {
    key: 'knowledgeBase3',
    data: {
      label: 'База Знаний 3',
    }
  },
  {
    key: 'knowledgeBase4',
    data: {
      label: 'База Знаний 4',
    }
  },
  {
    key: 'knowledgeBase5',
    data: {
      label: 'База Знаний 5',
    }
  },
  {
    key: 'knowledgeBase6',
    data: {
      label: 'База Знаний 6',
    }
  },
  {
    key: 'knowledgeBase7',
    data: {
      label: 'База Знаний 7',
    }
  },
  {
    key: 'knowledgeBase8',
    data: {
      label: 'База Знаний 8',
    }
  },
  {
    key: 'knowledgeBase0',
    data: {
      label: 'База Знаний 9',
    }
  },
  {
    key: 'knowledgeBase10',
    data: {
      label: 'База Знаний 10',
    }
  }
]);
const knowledgeBaseSelectedKey = ref(null);
const { t } = useI18n();

const fullTimeWork = ref<boolean>(false);

const workingZone = ref(null);

const workingZones = ref([
  {
    title: 'UTC +14 Christmas Island/Kiribati',
    id: 'utc14'
  },
  {
    title: 'UTC +5:45 Nepal',
    id: 'utc5_45'
  },
  {
    title: 'UTC +3:30 Iran',
    id: 'utc3_30'
  }
])

const mondayActive = ref(true);
const tuesdayActive = ref(true);
const wednesdayActive = ref(true);
const thursdayActive = ref(true);
const fridayActive = ref(true);
const saturdayActive = ref(true);
const sundayActive = ref(true);

const mondayTimeStart = ref(null);
const tuesdayTimeStart = ref(null);
const wednesdayTimeStart = ref(null);
const thursdayTimeStart = ref(null);
const fridayTimeStart = ref(null);
const saturdayTimeStart = ref(null);
const sundayTimeStart = ref(null);

const mondayTimeEnd = ref(null);
const tuesdayTimeEnd = ref(null);
const wednesdayTimeEnd = ref(null);
const thursdayTimeEnd = ref(null);
const fridayTimeEnd = ref(null);
const saturdayTimeEnd = ref(null);
const sundayTimeEnd = ref(null);
const temperatureValue = ref(0.3);

</script>

<template>
  <div class="grid">
    <div class="flex gap-2 w-full gap-4">
      <div class="card h-full flex flex-column w-full">
        <div class="flex justify-content-between">
          <h5>{{ $t('edit') }} "{{ bots.find((bot) => bot.id === Number(route.params.id)).title }}"</h5>
          <Button :label="t('save')"></Button>
        </div>
        <div>
          <TabView>
            <TabPanel :header="t('general')">
              <div class="card-form p-fluid" style="margin-top: 16px">
                <div class="field">
                  <label for="name1" style="font-weight: 700">{{ $t('botName') }}</label>
                  <InputText id="name1" type="text" />
                </div>
                <div class="field">
                  <div class="flex justify-content-between align-items-end">
                    <div class="flex flex-column">
                      <label style="font-weight: 700">{{ $t('botInstructionPrompt') }}</label>
                      <span class="mb-2 mt-2">{{ $t('promptUsageTip') }}</span>
                    </div>
                    <span style="color: #076AE1; margin-bottom: 7px">{{ $t('variables') }}</span>
                  </div>
                  <Textarea :placeholder="t('youBotConsultant')" :autoResize="true" rows="3" cols="2" />
                </div>
              </div>
              <span class="bot-card__activate">
                {{ $t('welcomeMessageStart') }}
                <InputSwitch v-model="switchValue" style="margin-left: 8px"/>
              </span>
              <div v-if="switchValue" class="card-form p-fluid">
                <div class="field" style="margin-top: 12px">
                  <Textarea :placeholder="t('autoMessageNote')" :autoResize="true" rows="3" cols="30" />
                </div>
              </div>
              <span class="bot-card__activate" style="margin-top: 8px">
                {{ $t('settings') }}
                <InputSwitch v-model="extra" style="margin-left: 8px"/>
              </span>
              <div v-if="extra" class="card-form p-fluid" style="margin-top: 12px">
                <label for="name1" style="font-weight: 700">{{ $t('apiSecretKey') }}</label>
                <Dropdown style="margin-top: 8px" id="apiKey" v-model="apiKey" :options="apiKeyTypes" optionLabel="title" :placeholder="t('chooseOption')"></Dropdown>
                <InputText style="margin-top: 8px; margin-bottom: 16px;" id="name1" type="password" />
                <label for="name1" style="font-weight: 700">{{ $t('model') }}</label>
                <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="apiKey" v-model="model" :options="models" optionLabel="title" :placeholder="t('chooseOption')"></Dropdown>
                <span style="color: #64748b">{{ $t('modelChoice') }}</span>

                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('temperature') }}</label>
                  <InputText style="margin-bottom: 8px" id="temperatureValue" type="number" min="1" v-model.number="temperatureValue" :disabled="true" />
                  <Slider style="margin-bottom: 8px" v-model="temperatureValue" :min="0" :max="2" :step="0.1"/>
                  <span style="color: #64748b">{{ $t('creativityLevel') }}</span>
                </div>

                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('maxTokens') }}</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" min="1" />
                  <span style="color: #64748b">{{ $t('requestCost') }}</span>
                </div>


                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('messageMergeTimeout') }}</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" min="1" />
                  <span style="color: #64748b">{{ $t('messageWaitTime') }}</span>
                </div>
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('responseTimeout') }}</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" min="1"/>
                  <span style="color: #64748b">{{ $t('conversationHistoryTimeout') }}</span>
                </div>
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('pauseMinutes') }}</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" min="1" />
                  <span style="color: #64748b">{{ $t('pauseOperator') }}</span>
                </div>

                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('limitingAIbot') }}</label>
                  <div class="flex align-items-center gap-2">
                    <span>{{ $t('maxMessages') }}</span>
                    <InputText id="name1" type="number" min="1" style="max-width: 150px" />
                    <span>{{ $t('onceWhile') }}</span>
                    <InputText id="name1" type="number" min="1" style="max-width: 150px" />
                    <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="apiKey" v-model="limitDay" :options="limitDays" optionLabel="title" :placeholder="t('chooseOption')"></Dropdown>
                  </div>
                </div>

                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('maxTokens') }}</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" min="1" />
                  <span style="color: #64748b">{{ $t('requestCost') }}</span>
                </div>

                <h5>{{ $t('manageBotMessages') }}</h5>
                <span>{{ $t('operatorControlPhrases') }}</span>
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('stopBot') }}</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="text" />
                </div>

                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('resumeBot') }}</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="text" />
                </div>

                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('workingHours') }}</label>
                  <span class="bot-card__activate" style="margin-top: 8px">
                    {{ $t('works247') }}
                  </span>
                  <span class="bot-card__activate">
                    {{ $t('setWorkingHours') }}
                    <InputSwitch v-model="fullTimeWork" style="margin-left: 8px"/>
                  </span>
                  <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="workingZone" v-model="workingZone" :options="workingZones" optionLabel="title" :placeholder="t('chooseOption')"></Dropdown>
                  <div v-if="fullTimeWork" class="flex flex-column gap-2 mt-3">
                    <div class="flex align-items-center gap-2">
                      <span style="width: 25px">ПН:</span>
                      <Calendar :disabled="!mondayActive" id="calendar-timeonly" timeOnly v-model="mondayTimeStart" />
                      <span>-</span>
                      <Calendar :disabled="!mondayActive" id="calendar-timeonly" timeOnly v-model="mondayTimeEnd" />
                      <span class="bot-card__activate" >
                        Работает
                        <InputSwitch v-model="mondayActive" style="margin-left: 8px"/>
                      </span>
                    </div>
                    <div class="flex align-items-center gap-2">
                      <span style="width: 25px">ВТ:</span>
                      <Calendar :disabled="!tuesdayActive" id="calendar-timeonly" timeOnly v-model="tuesdayTimeStart" />
                      <span>-</span>
                      <Calendar :disabled="!tuesdayActive" id="calendar-timeonly" timeOnly v-model="tuesdayTimeEnd" />
                      <span class="bot-card__activate" >
                        Работает
                        <InputSwitch v-model="tuesdayActive" style="margin-left: 8px"/>
                      </span>
                    </div>
                    <div class="flex align-items-center gap-2">
                      <span style="width: 25px">СР:</span>
                      <Calendar :disabled="!wednesdayActive" id="calendar-timeonly" timeOnly v-model="wednesdayTimeStart"/>
                      <span>-</span>
                      <Calendar :disabled="!wednesdayActive" id="calendar-timeonly" timeOnly v-model="wednesdayTimeEnd" />
                      <span class="bot-card__activate" >
                        Работает
                        <InputSwitch v-model="wednesdayActive" style="margin-left: 8px"/>
                      </span>
                    </div>
                    <div class="flex align-items-center gap-2">
                      <span style="width: 25px">ЧТ:</span>
                      <Calendar :disabled="!thursdayActive" id="calendar-timeonly" timeOnly v-model="thursdayTimeStart" />
                      <span>-</span>
                      <Calendar :disabled="!thursdayActive" id="calendar-timeonly" timeOnly v-model="thursdayTimeEnd" />
                      <span class="bot-card__activate" >
                        Работает
                        <InputSwitch v-model="thursdayActive" style="margin-left: 8px"/>
                      </span>
                    </div>
                    <div class="flex align-items-center gap-2">
                      <span style="width: 25px">ПТ:</span>
                      <Calendar :disabled="!fridayActive" id="calendar-timeonly" timeOnly v-model="fridayTimeStart" />
                      <span>-</span>
                      <Calendar :disabled="!fridayActive" id="calendar-timeonly" timeOnly v-model="fridayTimeEnd" />
                      <span class="bot-card__activate" >
                        Работает
                        <InputSwitch v-model="fridayActive" style="margin-left: 8px"/>
                      </span>
                    </div>
                    <div class="flex align-items-center gap-2">
                      <span style="width: 25px">СБ:</span>
                      <Calendar :disabled="!saturdayActive" id="calendar-timeonly" timeOnly v-model="saturdayTimeStart" />
                      <span>-</span>
                      <Calendar :disabled="!saturdayActive" id="calendar-timeonly" timeOnly v-model="saturdayTimeEnd" />
                      <span class="bot-card__activate" >
                        Работает
                        <InputSwitch v-model="saturdayActive" style="margin-left: 8px"/>
                      </span>
                    </div>
                    <div class="flex align-items-center gap-2">
                      <span style="width: 25px">ВС:</span>
                      <Calendar :disabled="!sundayActive" id="calendar-timeonly" timeOnly v-model="sundayTimeStart" />
                      <span>-</span>
                      <Calendar :disabled="!sundayActive" id="calendar-timeonly" timeOnly v-model="sundayTimeEnd" />
                      <span class="bot-card__activate" >
                        Работает
                        <InputSwitch v-model="sundayActive" style="margin-left: 8px"/>
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </TabPanel>
            <TabPanel :header="t('knowledgeBase')">
              <div class="flex gap-2 mt-5">
                <Button :label="t('createFile')" @click="createKnowledgeBase(parseInt(<string>route.params.id))"/>
                <Button :label="t('uploadFail')"/>
                <Button :label="t('delete')"/>
              </div>
              <div>
                <TreeTable v-model:selectionKeys="knowledgeBaseSelectedKey" :value="knowledgeBaseList" selectionMode="checkbox" class="w-full">
                  <Column field="label" :header="t('title')" :expander="true"></Column>
                  <Column field="actions">
                    <template #body>
                      <div class="flex flex-row-reverse gap-3 ml-auto">
                        <i style="cursor: pointer; color: #EE9186;" class="pi pi-trash" />
                        <i style="cursor: pointer" class="pi pi-file-edit" />
                        <i style="cursor: pointer; color: #187CF9" class="pi pi-download" />
                      </div>
                    </template>
                  </Column>
                </TreeTable>
              </div>
            </TabPanel>
            <TabPanel :header="t('channels')">
              <div class="chanel-list">
                <span class="chanel-list__item">
                  Instagram
                  <i style="cursor: pointer" class="pi pi-cog" />
                </span>
                <span class="chanel-list__item">
                  Whatsapp
                  <i style="cursor: pointer" class="pi pi-cog" />
                </span>
                <span class="chanel-list__item">
                  Telegram
                  <i style="cursor: pointer" class="pi pi-cog" />
                </span>
                <span class="chanel-list__item">
                  amoCRM
                  <i style="cursor: pointer" class="pi pi-cog" />
                </span>
                <span class="chanel-list__item">
                  Bitrix24
                  <i style="cursor: pointer" class="pi pi-cog" />
                </span>
                <span class="chanel-list__item">
                  Jivo
                  <i style="cursor: pointer" class="pi pi-cog" />
                </span>
              </div>
            </TabPanel>
            <TabPanel :header="t('notifications')">
              <div class="notification-wrapper">
                <div class="notification-card">
                  <div class="flex flex-column gap-2">
                    <h5>{{ $t('telegram') }}</h5>
                    <span style="color: #0f172a;">{{ $t('subscribeBotLink') }}<a target="_blank" href="https://web.telegram.org/" style="color: #076AE1;">({{ $t('link') }})</a></span>
                  </div>
                </div>
                <div class="notification-card">
                  <div class="flex flex-column gap-2">
                    <h5>{{ $t('email') }}</h5>
                    <span style="color: #0f172a;">{{ $t('enterEmailForNotifications') }}</span>
                    <InputText class="mt-3" style="max-width: 500px" :placeholder="t('email')" id="email" type="text" />
                  </div>
                </div>
                <div class="notification-card">
                  <div class="flex flex-column gap-2">
                    <h5>{{ $t('webhooks') }}</h5>
                    <span style="color: #0f172a;">{{ $t('webhookUrl') }}</span>
                    <InputText class="mt-3" style="max-width: 500px" placeholder="Url" id="site" type="text" />
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
        <div class="mt-auto ml-auto flex gap-4 align-items-center">
          <nuxt-link to="/chatbots" style="color: #334155">{{ $t('goBack')}}</nuxt-link>
          <Button :label="t('save')"></Button>
        </div>
      </div>
      <div class="layout-chat">
        <div class="card-chat h-full">
          <div class="flex justify-content-between align-items-center">
            <div style="font-weight: 700">{{ $t('chatWithBot') }} <br>"{{ bots.find((bot) => bot.id === Number(route.params.id)).title }}"</div>
            <i style="cursor: pointer; font-size: 18px" class="pi pi-trash" />
          </div>
          <div class="h-full mb-2 mt-2 rounded-xl" style="background: #F9FAFC" />
          <div class="mt-auto flex justify-content-between align-items-center gap-3">
            <InputText type="text" id="message" class="w-full" />
            <i style="cursor: pointer; font-size: 18px" class="pi pi-send" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bot-list {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

/* Media query for smaller screens (e.g., mobile devices) */
@media (max-width: 600px) {
  .bot-list {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
.layout-chat {
  width: 300px;
  min-width: 300px;
  height: calc(100vh - 9rem);
  //z-index: 999;
  overflow-y: auto;
}
</style>