<script setup lang="ts">
import { useBotStore } from "~/src/shared/store/bot";
import { useChannelStore } from "~/src/shared/store/channel";
import { useKnowledgeStore } from "~/src/shared/store/knowledge";
import { useMainStore } from "~/src/shared/store/main";
import { useNotificationStore } from "~/src/shared/store/notification";
import { queryGetModelList } from "~/src/shared/repository/dictionaries";
import jsCookie from "js-cookie";
import { useToast } from "primevue/usetoast";
import { helpers, minLength, required, email, requiredIf } from "@vuelidate/validators";
import useValidate from "@vuelidate/core/dist/index";
import { socket, state } from "~/socket";
import { useLayout } from '~/composable';
const { isMobileOrTablet } = useDevice();

const { chatVisible } = useLayout();


const toast = useToast();
interface BotItem {
  title: string;
  id: number;
  channels: string[];
  isActive: boolean
}
const route = useRoute();

const userId = computed(() => {
  const userCookie = jsCookie.get('user')
  const user = userCookie ? JSON.parse(userCookie) : null
  return user?._id
})

const botStore = useBotStore();
const channelStore = useChannelStore();
const knowledgeStore = useKnowledgeStore();
const mainStore = useMainStore();
const notificationStore = useNotificationStore();
const extra = ref<boolean>(true);


const { data: models, suspense: suspenseModels } = queryGetModelList();

await suspenseModels();
const { t } = useI18n();

const apiKeyTypes = ref([
  {
    title: t('useSeparateToken'),
    code: 'own'
  },
  {
    title: t('use7sTokens'),
    code: 'shared'
  }
]);

const limitDays = computed(() => {
  return [
    {
      title: t('perDay'),
      id: 'day'
    },
    {
      title: t('perHour'),
      id: 'hour'
    }
  ]
})
const apiKey = ref({
  title: 'Использовать отдельный токен для этого бота',
  code: 'individual_token'
});
const model = ref(null);

const createKnowledgeBase = (id: number) => {
  return navigateTo({ name: 'chatbots-knowledge-id', params: { id: id }})
}

const knowledgeBaseList = ref([
  {
    key: 'knowledgeBase1',
    data: {
      label: 'База Знаний 1',
      notification: true,
      active: true
    }
  },
  {
    key: 'knowledgeBase2',
    data: {
      label: 'База Знаний 2',
      notification: false,
      active: true
    }
  },
  {
    key: 'knowledgeBase3',
    data: {
      label: 'База Знаний 3',
      notification: false,
      active: true
    }
  },
  {
    key: 'knowledgeBase4',
    data: {
      label: 'База Знаний 4',
      notification: true,
      active: true
    }
  },
  {
    key: 'knowledgeBase5',
    data: {
      label: 'База Знаний 5',
      notification: true,
      active: true
    }
  },
  {
    key: 'knowledgeBase6',
    data: {
      label: 'База Знаний 6',
      notification: true,
      active: true
    }
  },
  {
    key: 'knowledgeBase7',
    data: {
      label: 'База Знаний 7',
      notification: true,
      active: true
    }
  },
  {
    key: 'knowledgeBase8',
    data: {
      label: 'База Знаний 8',
      notification: false,
      active: true
    }
  },
  {
    key: 'knowledgeBase0',
    data: {
      label: 'База Знаний 9',
      notification: true,
      active: true
    }
  },
  {
    key: 'knowledgeBase10',
    data: {
      label: 'База Знаний 10',
      notification: false,
      active: true
    }
  }
]);
const knowledgeBaseSelectedKey = ref(null);

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

const active = ref(true)
const filters = ref({});

const message = ref<string>('')



const channelStatus = ref('');


const funnelInAmoCRM = ref(null);


const currentBot = ref({
  _id: '',
  user_id: '',
  instructions: '',
  apiKey: '',
  apiKeyType: '',
  controlSignals: {
    stopBot: '',
    continueBot: ''
  },
  description: '',
  gpt_assistant_id: '',
  hello_on_first: false,
  helloMessage: '',
  isLimit: false,
  isSchedule: false,
  joinTimeout: 0,
  maxTokens: 300,
  bigTimeout: 24,
  messageLimit: {
    qty: 30,
    period: 1,
    granularity: 'day',
  },
  model: 'gpt-4o',
  name: '',
  operatorStopTime: 20,
  schedule: {
    start: '',
    end: '',
    offset: 5
  },
  smallTimeout: 10,
  stopOnOperator: false,
  temperature: 0.5,
  whisper: false,
})

const botRules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(t('required'), required)
    },
    apiKey: {
      requiredIf: helpers.withMessage(t('required'), requiredIf(() => currentBot.value.apiKeyType === 'own')),
    }
  }
})
const v$ = useValidate(botRules, currentBot);
const telegramLink = ref<string>('')

const isJoinedChat = ref<boolean>(false)
const joinToChat = () => {
  socket.emit('joinChat', { botId: <string>route.params.id, userId: userId.value })
  isJoinedChat.value = true
}


onUnmounted(() => {
  socket.disconnect();
})
onMounted(async () => {
  socket.connect();
  await Promise.all([
    botStore.getBot(<string>route.params.id).then((res) => {
      Object.keys(currentBot.value).forEach(key => {
        if (key in res && res[key] !== null && res[key] !== undefined) {
          currentBot.value[key] = res[key];
        }
      });
    }),
    channelStore.getAllChannels(),
     knowledgeStore.getKnowledgeListByBot(<string>route.params.id),
     notificationStore.getTelegramNotificationLink().then((res) => {
      const response = JSON.parse(res)
      telegramLink.value = response?.link
    })
  ])
})

const clearChat = () => {
  socket.disconnect();
  state.messages.splice(0,state.messages.length)
}

const sendMessage = () => {
  if (!currentBot.value.apiKeyType) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Заполняйте API Key и сохраните бота', life: 5000 })
  } else {
    if (!isJoinedChat.value) {
      joinToChat();
    }
    if (message.value.trim() !== '' ) {
      const currentMessage = message.value; // Capture the current message value

      setTimeout(() => {
        socket.emit('message', currentMessage)
      }, 1000)

      state.messages.unshift({ id: state.messages.length + 1, sender: 'Me', message: message.value });
      message.value = '';
    }
  }
}

const bot = computed(() => {
  return botStore.getCurrentBot
});

const allChannels = computed(() => {
  return channelStore.getChannels
})

const availableChannels = computed(() => {
  return channelStore.getChannels?.filter((channel) => !channel.connected)
})

const connectedChannels = computed(() => {
  return channelStore.getChannels?.filter((channel) => channel?.connectedBotId === <string>route.params.id)
})
const confirmBotMainSettings = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    await botStore.editBot(<string>route.params.id, currentBot.value).then((res) => {
      toast.add({ severity: 'success', summary: t('ready'), life: 5000 });
    })
  }
}

const visibleDeleteBot = ref<boolean>(false)
const removeBot = async () => {
  visibleDeleteBot.value = true;
}

const confirmRemoveBot = async () => {
  await botStore.deleteBot(<string>route.params.id).then((res) => {
    if (res?.success) {
      return navigateTo('/chatbots')
    }
  })
}

const createChannel = () => {
  return navigateTo({ name: 'channels' })
}

const connectToBot = async (channelId: string) => {
  await channelStore.connectChannelToBot(channelId, <string>route.params.id)
}
const disconnectToBot = async (channelId: string) => {
  await channelStore.disconnectChannelToBot(channelId, <string>route.params.id)
}

const files = computed(() => {
  return knowledgeStore.getKnowledgeList
});

const deleteKnowledgeFile = async (knowledgeId: string) => {
  await knowledgeStore.deleteKnowledgeFile(<string>route.params.id, knowledgeId).then(async (res) => {
    if (res.success) {
      await knowledgeStore.getKnowledgeListByBot(<string>route.params.id)
    }
  })
}

const editKnowledgeFile = (knowledgeId: string) => {
  return navigateTo({ name: 'chatbots-knowledge-edit-id', params: { id: route.params.id }, query: { knowledgeId: knowledgeId }})
}

const openTelegram = () => {
  window.open(telegramLink.value, '_blank');
}
const activeTab = ref(mainStore.chatBotActiveTab)
const messages = computed(() => {
  return state.messages.reverse();
})

function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}
</script>

<template>
  <Toast />
  <Dialog v-model:visible="visibleDeleteBot" modal :header="t('deleteBotButton')" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">{{ $t('aIBotWillDeleted') }}</span>
    <div class="flex justify-content-center gap-2 w-full">
      <Button type="button" :label="t('delete')" severity="danger" @click="confirmRemoveBot"></Button>
      <Button type="button" :label="t('cancel')" @click="visibleDeleteBot = false"></Button>
    </div>
  </Dialog>

  <div class="grid">
    <div class="app-wrapper">
      <div class="card h-full flex flex-column w-full">
        <div class="flex justify-content-between">
          <h5>{{ $t('edit') }} "{{ bot?.name }}"</h5>
          <div class="flex align-items-center gap-4">
            <nuxt-link to="/chatbots" style="color: #334155">{{ $t('goBack')}}</nuxt-link>
            <Button :label="t('save')" @click="confirmBotMainSettings"></Button>
          </div>
        </div>
        <div>
          <TabView v-model:activeIndex="activeTab">
            <TabPanel :header="t('general')">
              <div class="card-form p-fluid" style="margin-top: 16px">

                <!--Bot name-->
                <div class="field">
                  <label for="name1" style="font-weight: 700">{{ $t('botName') }}</label>
                  <InputText id="botName" type="text" v-model="currentBot.name" :invalid="v$.$errors.find((el) => el.$property === 'name')?.$message" />
                </div>

                <!--Bot instructions-->
                <div class="field">
                  <div class="flex justify-content-between align-items-end">
                    <div class="flex flex-column">
                      <label style="font-weight: 700">{{ $t('botInstructionPrompt') }}</label>
                      <span class="mb-2 mt-2">{{ $t('promptUsageTip') }}</span>
                    </div>
                    <span style="color: #076AE1; margin-bottom: 7px">{{ $t('variables') }}</span>
                  </div>
                  <Textarea :placeholder="t('youBotConsultant')" :autoResize="false" rows="25" cols="2" v-model="currentBot.instructions"/>
                </div>
              </div>

              <!--Bot helloOnFirst-->
              <span class="bot-card__activate">
                {{ $t('welcomeMessageStart') }}
                <InputSwitch v-model="currentBot.hello_on_first" style="margin-left: 8px"/>
              </span>

              <div v-if="currentBot.hello_on_first" class="card-form p-fluid">
                <div class="field" style="margin-top: 12px">
                  <Textarea :placeholder="t('autoMessageNote')" :autoResize="true" rows="3" cols="30" v-model="currentBot.helloMessage" />
                </div>
              </div>
              <span class="bot-card__activate" style="margin-top: 8px">
                {{ $t('settings') }}
                <InputSwitch v-model="extra" style="margin-left: 8px"/>
              </span>
              <div v-if="extra" class="card-form p-fluid" style="margin-top: 12px">

                <!--Bot apiSecretKey-->
                <label for="name1" style="font-weight: 700">{{ $t('apiSecretKey') }}</label>
                <Dropdown class="mb-2" style="margin-top: 8px" id="apiKey" v-model="currentBot.apiKeyType" :options="apiKeyTypes" optionLabel="title" option-value="code" :placeholder="t('chooseOption')"></Dropdown>
                <InputText v-if="currentBot.apiKeyType === 'own'" style="margin-top: 8px; margin-bottom: 16px;" id="name1" v-model="currentBot.apiKey" :placeholder="t('apiKey')" :invalid="v$.$errors.find((el) => el.$property === 'apiKey')?.$message" />

                <!--Bot model-->
                <label for="name1" style="font-weight: 700">{{ $t('model') }}</label>
                <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="apiKey" v-model="currentBot.model" :options="models" optionLabel="name" option-value="name" :placeholder="t('chooseOption')"></Dropdown>
                <span style="color: #64748b">{{ $t('modelChoice') }}</span>

                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('temperature') }}</label>
                  <InputText style="margin-bottom: 8px" id="temperatureValue" type="number" min="1" v-model.number="currentBot.temperature" :disabled="true" />
                  <Slider style="margin-bottom: 8px" v-model="currentBot.temperature" :min="0" :max="2" :step="0.1"/>
                  <span style="color: #64748b">{{ $t('creativityLevel') }}</span>
                </div>

                <!--Bot maxTokens-->
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('maxTokens') }}</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" min="1" v-model="currentBot.maxTokens" />
                  <span style="color: #64748b">{{ $t('requestCost') }}</span>
                </div>

                <!--Bot joinTimeout-->
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('messageMergeTimeout') }}</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" min="1" v-model="currentBot.smallTimeout"/>
                  <span style="color: #64748b">{{ $t('messageWaitTime') }}</span>
                </div>

                <!--Bot bigTimeout-->
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('responseTimeout') }}</label>
                  <InputText style="margin-bottom: 8px" id="bigTimeout" type="number" min="1" v-model="currentBot.bigTimeout"/>
                  <span style="color: #64748b">{{ $t('conversationHistoryTimeout') }}</span>
                </div>

                <!--Bot operatorStopTime-->
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('pauseMinutes') }}</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" min="1" v-model="currentBot.operatorStopTime" />
                  <span style="color: #64748b">{{ $t('pauseOperator') }}</span>
                </div>

                <!--Bot messageLimit-->
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('limitingAIbot') }}</label>
                  <div class="flex align-items-center gap-2">
                    <span>{{ $t('maxMessages') }}</span>
                    <InputText id="message-limit-qty" type="number" min="1" style="max-width: 150px" v-model="currentBot.messageLimit.qty"/>
                    <span>{{ $t('onceWhile') }}</span>
                    <InputText id="message-limit-period" type="number" min="1" style="max-width: 150px" v-model="currentBot.messageLimit.period"/>
                    <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="message-limit-granularity" v-model="currentBot.messageLimit.granularity" :options="limitDays" optionLabel="title" option-value="id" :placeholder="t('chooseOption')"></Dropdown>
                  </div>
                </div>

                <h5>{{ $t('manageBotMessages') }}</h5>
                <span>{{ $t('operatorControlPhrases') }}</span>

                <!--Bot stopBot-->
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('stopBot') }}</label>
                  <InputText style="margin-bottom: 8px" id="stopBot" type="text" v-model="currentBot.controlSignals.stopBot" />
                </div>

                <!--Bot stopBot-->
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">{{ $t('resumeBot') }}</label>
                  <InputText style="margin-bottom: 8px" id="resumeBot" type="text" v-model="currentBot.controlSignals.continueBot" />
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
              <div class="mt-4 flex gap-4 align-items-center justify-content-end">
                <Button :label="t('deleteBotButton')" severity="danger" class="mr-auto" @click="removeBot"></Button>
                <nuxt-link to="/chatbots" style="color: #334155">{{ $t('goBack')}}</nuxt-link>
                <Button :label="t('save')" @click="confirmBotMainSettings"></Button>
              </div>
            </TabPanel>

            <TabPanel :header="t('channels')">
              <div class="mt-3" v-if="!allChannels.length">
                <Button :label="t('creatingChannel')" @click="createChannel"></Button>
              </div>

              <div class="chanel-list" v-if="connectedChannels.length">
                <h5 class="font-bold mb-2">{{ $t('connectedChannelsToBot') }}</h5>
                <span class="chanel-list__item" v-for="channel in connectedChannels" :key="channel._id">
                  {{ channel.title }}
                  <span class="font-bold ml-2">({{ channel.type }})</span>
                  <span class="ml-auto" style="color: #19C927">{{ $t('connected') }}</span>
                  <InputSwitch style="margin-left: 30px" v-model="channel.connected" @change="disconnectToBot(channel._id)"  />
                </span>
              </div>

              <div class="chanel-list" v-if="availableChannels.length">
                <h5 class="font-bold mb-2">{{ $t('availableChannels') }}</h5>
                <span class="chanel-list__item" v-for="channel in availableChannels" :key="channel._id">
                  {{ channel.title }}
                  <span class="font-bold ml-2">({{ channel.type }})</span>
                  <span class="ml-auto">{{ $t('connectToBot') }}</span>
                  <InputSwitch style="margin-left: 30px" v-model="channel.connected" @change="connectToBot(channel._id)"  />
                </span>
              </div>
            </TabPanel>

            <TabPanel :header="t('knowledgeBase')">
              <div class="flex gap-2 mt-5" style="margin-left: 1rem">
                <Button :label="t('createFile')" @click="createKnowledgeBase(route.params.id)"/>
                <Button :label="t('uploadFail')"/>
                <Button :label="t('delete')" :disabled="!knowledgeBaseSelectedKey" />
              </div>
              <div>
                <TreeTable v-model:selectionKeys="knowledgeBaseSelectedKey" :value="files" selectionMode="checkbox" class="w-full">
                  <template #header>
                    <div class="text-left">
                      <InputText v-model="filters['global']" :placeholder="t('searchBase')" />
                    </div>
                  </template>
                  <Column field="label" :header="t('title')" :expander="true" style="width: 40%"></Column>
                  <Column field="notification" :header="t('notifications')" class="ml-auto">
                    <template #body="slotProps">
                      <div>
                        <i v-if="slotProps?.node?.data?.notification" class="pi pi-check-circle"></i>
                        <i v-else class="pi pi-circle"></i>
                      </div>
                    </template>
                  </Column>
                  <Column field="notification" :header="t('stopBotButton')">
                    <template #body="slotProps">
                      <div>
                        <i v-if="!slotProps?.node?.data?.notification" class="pi pi-check-circle"></i>
                        <i v-else class="pi pi-circle"></i>
                      </div>
                    </template>
                  </Column>
                  <Column field="notification" :header="t('onOffButton')">
                    <template #body="slotProps">
                      <div>
                        <InputSwitch v-model="active" style="margin-left: 8px"/>
                      </div>
                    </template>
                  </Column>

                  <Column field="actions">
                    <template #body="slotProps">
                      <div class="flex flex-row-reverse gap-3 ml-auto">
                        <i style="cursor: pointer; color: #EE9186;" class="pi pi-trash" @click="deleteKnowledgeFile(slotProps?.node?.key)" />
                        <i style="cursor: pointer" class="pi pi-file-edit" @click="editKnowledgeFile(slotProps?.node?.key)" />
                        <i style="cursor: pointer; color: #187CF9" class="pi pi-download" />
                      </div>
                    </template>
                  </Column>
                </TreeTable>
              </div>
            </TabPanel>

            <TabPanel :header="t('notifications')">
              <div class="notification-wrapper">
                <div class="notification-card">
                  <div class="flex flex-column gap-2">
                    <h5>{{ $t('telegram') }}</h5>
                    <span style="color: #0f172a;">{{ $t('subscribeBotLink') }}
                    </span>
                    <Button severity="secondary" raised :label="t('subscribe')" style="width: 30%" class="mt-3" @click="openTelegram"/>
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
                  <div class="flex align-items-end">
                    <div class="flex flex-column gap-2 w-3/4">
                      <h5>{{ $t('webhooks') }}</h5>
                      <span style="color: #0f172a;">{{ $t('webhookUrl') }}</span>
                      <InputText class="mt-3" style="max-width: 500px" placeholder="Url" id="site" type="text" />
                    </div>
                    <div class="json-snippet">
                      <span class="font-bold">json</span>
                      <span class="ml-2 font-bold">fghj</span>
                      <span class="ml-4 font-bold">"ghjkl;'"</span>
                      <span class="ml-2 font-bold">"hjbnmpokl"</span>
                      <span class="font-bold">end</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>


      <div v-if="isMobileOrTablet && chatVisible" class="chat">
        <div class="layout-chat">
          <div class="card-chat h-full">
            <div class="flex justify-content-between align-items-center">
              <div>{{ $t('chatWithBot') }} <br>"{{ bot?.name }}"</div>
              <i style="cursor: pointer; font-size: 18px; margin-right: 10px" class="pi pi-trash" @click="clearChat" />
            </div>
            <div class="chat-messages h-full">
              <div v-for="(message, index) in state.messages" :key="index" :class="{'user-message': message.sender === 'Me', 'bot-message': message.sender === 'Bot'}">
                {{ message.message }}
              </div>
            </div>
            <div class="mt-auto flex justify-content-between align-items-center gap-3">
              <Textarea style="max-height: 80px" type="text" id="message" class="w-full" maxlength="1000" :autoResize="true" rows="1" cols="2" v-model="message" @keydown="handleKeyDown" />
              <i style="cursor: pointer; font-size: 18px; margin-right: 10px" class="pi pi-send" @click="sendMessage" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  gap: 16px;
}
.bot-list {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.chat {
  min-width: 300px;
}
/* Media query for smaller screens (e.g., mobile devices) */
@media (max-width: 600px) {
  .bot-list {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .chat {
    position: fixed;
    top: 70px;
    width: 100%;
    left: 0;
    bottom: 0;
    background: white;
    z-index: 1000;
  }
  .layout-chat {
    width: 100% !important;
    min-width: 100% !important;
    left: 0;
    height: calc(100vh - 70px) !important;
  }
}
@supports (height: 100dvh) {
  .layout-chat {
    height: calc(100dvh - 70px) !important;
  }

}
.layout-chat {
  width: 300px;
  min-width: 300px;
  height: calc(100vh - 9rem);
  overflow-y: auto;
  position: fixed;
  right: 2rem;
}
:deep(.p-treetable .p-treetable-toggler) {
  display: none;
}
.json-snippet {
  background-color: #D6F0FF;
  border-radius: 4px;
  padding: 8px;
  height: 100px;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.user-message {
  text-align: right;
  color: white;
  padding: 9px;
  background-color: #175CCA;
  border-radius: 8px;
  display: inline-block;
  max-width: 80%;
  align-self: flex-end;
}
.bot-message {
  text-align: left;
  color: white;
  padding: 8px;
  background-color: green;
  border-radius: 8px;
  display: inline-block;
  max-width: 80%;
  align-self: flex-start;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 10px;
  background-color: #fff;
  gap: 12px;
}

</style>