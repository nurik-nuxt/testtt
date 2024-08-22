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
import {useUploadFileStore} from "~/src/shared/store/upload";
import {useAmoCrmStore} from "~/src/shared/store/amocrm";
import { useLoaderStore } from "~/src/shared/store/loader";
import { BaseFile } from "~/src/shared/components/base";

const { isMobileOrTablet } = useDevice();

const { chatVisible, setToggleChat } = useLayout();

watch(
    () => isMobileOrTablet,
    (val) => {
      if (!val) {
        setToggleChat(true)
      }
    },
    { deep: true, immediate: true }
)

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
const uploadFileStore = useUploadFileStore();
const amoCrmStore = useAmoCrmStore();
const loaderStore = useLoaderStore();

const loading = computed(() => {
  return loaderStore.getLoading;
})


const extra = ref<boolean>(true);


const { data: models, suspense: suspenseModels } = queryGetModelList();

await suspenseModels();
const { t } = useI18n();

const apiKeyTypes = ref([
  {
    title: t('useSeparateToken'),
    code: 'own',
    disabled: false,
  },
  {
    title: t('use7sTokens'),
    code: 'shared',
    disabled: true,
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
function ensureAllActionsExist(botFunction: any) {
  const requiredActions = [
    {
      name: 'send_file',
      parameters: {
        fileName: null,
        type: null
      }
    },
    {
      name: 'send_webhook',
      parameters: {
        webhook_url: '',
        webhook_text: ''
      }
    },
    {
      name: 'notify_operator',
      parameters: {
        text: ''
      }
    },
    {
      name: 'edit_lead_card',
      parameters: {
        custom_fields_values: [
          {
            field_id: null,
            values: [
              {
                value: ''
              }
            ]
          }
        ]
      }
    },
    {
      name: 'add_note',
      parameters: {
        text: ''
      }
    },
    {
      name: 'move_in_pipeline',
      parameters: {
        pipeline_id: '',
        status_id: ''
      }
    }
  ];

  requiredActions.forEach(requiredAction => {
    const exists = botFunction.actions.some(action => action?.name === requiredAction.name);
    if (!exists) {
      botFunction.actions.push({ ...requiredAction });
    }
  });

  return botFunction;
}

onMounted(async () => {
  socket.connect();

  await Promise.all([
    amoCrmStore.fetchVoronki(),
    amoCrmStore.fetchAmoCrmFields(),
    botStore.getBot(<string>route.params.id).then((res) => {
      if (res?.functions) {
        botFunctions.value = res.functions.map(botFunction => ensureAllActionsExist(botFunction));
      }

      Object.keys(currentBot.value).forEach(key => {
        if (key in res && res[key] !== null && res[key] !== undefined) {
          currentBot.value[key] = res[key];
        }
      });
    }),
    channelStore.getAllChannels(),
    knowledgeStore.getKnowledgeListByBot(<string>route.params.id),
    notificationStore.getTelegramNotificationLink().then((res) => {
      console.log(res);
      const response = JSON.parse(res);
      telegramLink.value = response?.link;
    })
  ]);
});

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
function filterEmptyActions(actions: any[]) {
  return actions.filter(action => {
    if (action.name === 'send_file' && (!action.parameters.fileName || !action.parameters.type)) {
      return false;
    }
    if (action.name === 'send_webhook' && (!action.parameters.webhook_url || !action.parameters.webhook_text)) {
      return false;
    }
    if (action.name === 'notify_operator' && !action.parameters.text) {
      return false;
    }
    if (action.name === 'edit_lead_card' && (!action.parameters.custom_fields_values[0].field_id || !action.parameters.custom_fields_values[0].values[0].value)) {
      return false;
    }
    if (action.name === 'add_note' && !action.parameters.text) {
      return false;
    }
    return !(action.name === 'move_in_pipeline' && (!action.parameters.pipeline_id || !action.parameters.status_id));

  });
}

const confirmBotMainSettings = async () => {
  const isFormCorrect = await v$.value.$validate();

  botFunctions.value = botFunctions.value.map((botFunction: any) => ({
    ...botFunction,
    actions: filterEmptyActions(botFunction.actions)
  }));
  if (isFormCorrect) {
    await botStore.editBot(<string>route.params.id, currentBot.value).then((res) => {
      toast.add({ severity: 'success', summary: t('ready'), life: 5000 });
    })
  }
  if (countFunctionChanging.value > 1) {
    await botStore.saveFunctionById(<string>route.params.id, botFunctions.value)
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

const botTask = ref<string>('');
const interruptDialogue = ref<boolean>(false);

const notificationText = ref<string>('');

const webhookUrl = ref<string>('')

const botFunctions = ref<any>([])

const deleteFunctionSendFile = (file: any, functionIndex: number, fileIndex: number) => {
  const action = botFunctions.value[functionIndex]?.actions;
  for (let i = 0; i < action.length; i++) {
    if (action[i]?.name === 'send_file') {
      delete action[i];
      break;
    }
  };
  showFileDeleteModal.value = false;
}

const openFileUploader = (functionIndex: number) => {
  const fileInput = document.getElementById(`file-upload-${functionIndex}`);
  if (fileInput) {
    fileInput.click();
  }
}

const addFile = async (event: Event, functionIndex: number) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;
  if (!file) return;
  await uploadFileStore.loadFile(file).then((res) => {
    console.log(res?.mimeType)
    botFunctions.value[functionIndex]?.actions?.push({
      name: 'send_file',
      parameters: {
        fileName: res?.filename,
        type: res?.mimeType?.includes('image') ? 'picture' : res?.mimeType?.includes('pdf') ? 'pdf' : res?.mimeType?.includes('spreadsheetml')  ? 'excel' : res?.mimeType?.includes('wordprocessingml') ? 'docs' : 'file'
      }
    })
  });
}
const addTask = () => {
  botFunctions.value.push(
      {
        name: '',
        prompt: '',
        actions: [
          {
            name: 'send_file',
            parameters: {
              fileName: null,
              type: null
            }
          },
          {
            name: 'send_webhook',
            parameters: {
              webhook_url: '',
              webhook_text: ''
            }
          },
          {
            name: 'notify_operator',
            parameters: {
              text: ''
            }
          },
          {
            name: 'edit_lead_card',
            parameters: {
              custom_fields_values: [
                {
                  field_id: null,
                  values: [
                    {
                      value: ''
                    }
                  ]
                }
              ]
            }
          },
          {
            name: 'add_note',
            parameters: {
              text: ''
            }
          },
          {
            name: 'move_in_pipeline',
            parameters: {
              pipeline_id: '',
              status_id: ''
            }
          }
        ]
      }
  )
}

const getNotifyOperatorText = (index: number) => {
  return computed({
    get() {
      const action = botFunctions.value[index]?.actions?.find((action) => action?.name === 'notify_operator');
      if (action && action.parameters) {
        return action.parameters.text || '';
      }
      return '';
    },
    set(value) {
      const action = botFunctions.value[index]?.actions?.find((action) => action?.name === 'notify_operator');
      if (action && action.parameters) {
        action.parameters.text = value;
      }
    }
  });
};

const getWebhookUrl = (index: number) => {
  return computed({
    get() {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'send_webhook');
      if (action && action.parameters) {
        return action.parameters.webhook_url || '';
      }
      return '';
    },
    set(value) {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'send_webhook');
      if (action && action.parameters) {
        action.parameters.webhook_url = value;
      }
    }
  });
};

const getWebhookText = (index: number) => {
  return computed({
    get() {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'send_webhook');
      if (action && action.parameters) {
        return action.parameters.webhook_text || '';
      }
      return '';
    },
    set(value) {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'send_webhook');
      if (action && action.parameters) {
        action.parameters.webhook_text = value;
      }
    }
  });
};

const funnels = computed(() => {
  return amoCrmStore.getAllFunnels
})
const getFunnelId = (index: number) => {
  return computed({
    get() {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'move_in_pipeline');
      if (action && action.parameters) {
        return action.parameters.pipeline_id || '';
      }
      return '';
    },
    set(value) {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'move_in_pipeline');
      if (action && action.parameters) {
        action.parameters.pipeline_id = value;
      }
    }
  });
};

const getStatusId = (index: number) => {
  return computed({
    get() {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'move_in_pipeline');
      if (action && action.parameters) {
        return action.parameters.status_id || '';
      }
      return '';
    },
    set(value) {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'move_in_pipeline');
      if (action && action.parameters) {
        action.parameters.status_id = value;
      }
    }
  });
};

const getDealNoteText = (index: number) => {
  return computed({
    get() {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'add_note');
      if (action && action.parameters) {
        return action.parameters.text || '';
      }
      return '';
    },
    set(value) {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'add_note');
      if (action && action.parameters) {
        action.parameters.text = value;
      }
    }
  });
};
const fields = computed(() => {
  return amoCrmStore.getFields
})

const getFieldId = (index: number) => {
  return computed({
    get() {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'edit_lead_card');
      if (action && action.parameters && action.parameters.custom_fields_values && action.parameters.custom_fields_values[0]) {
        return action.parameters.custom_fields_values[0].field_id || '';
      }
      return '';
    },
    set(value) {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'edit_lead_card');
      if (action && action.parameters && action.parameters.custom_fields_values && action.parameters.custom_fields_values[0]) {
        action.parameters.custom_fields_values[0].field_id = value;
      }
    }
  });
};

const getFieldValue = (index: number) => {
  return computed({
    get() {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'edit_lead_card');
      if (action && action.parameters && action.parameters.custom_fields_values && action.parameters.custom_fields_values[0] && action.parameters.custom_fields_values[0].values && action.parameters.custom_fields_values[0].values[0]) {
        return action.parameters.custom_fields_values[0].values[0].value || '';
      }
      return '';
    },
    set(value) {
      const action = botFunctions.value[index]?.actions?.find(action => action?.name === 'edit_lead_card');
      if (action && action.parameters && action.parameters.custom_fields_values && action.parameters.custom_fields_values[0] && action.parameters.custom_fields_values[0].values && action.parameters.custom_fields_values[0].values[0]) {
        action.parameters.custom_fields_values[0].values[0].value = value;
      }
    }
  });
};
const countFunctionChanging = ref<number>(0);
watch(
    () => botFunctions.value,
    () => {
      countFunctionChanging.value ++
    },
    {
      deep: true,
      immediate: false
    }
)
const deleteFunction = async (index: number) => {
  botFunctions.value.splice(index-1, 1);
  showFuctionDeleteModal.value = false;
}

const showFileDeleteModal = ref<boolean>(false);
const showFuctionDeleteModal = ref<boolean>(false);

onMounted(() => {
  mainStore.setChatBotActiveTab(1)
})
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
            <Button :label="t('save')" @click="confirmBotMainSettings" :disabled="loading"></Button>
          </div>
        </div>
        <div>
          <TabView v-model:activeIndex="activeTab">
            <TabPanel :header="`1.${t('general')}`">
              <div class="card-form p-fluid" style="margin-top: 16px">

                <!--Bot name-->
                <div class="field">
                  <label for="name1" style="font-weight: 700">{{ $t('botName') }}</label>
                  <InputText id="botName" type="text" v-model="currentBot.name" :invalid="v$.$errors.find((el) => el.$property === 'name')?.$message" />
                </div>
              </div>
              <div class="card-form p-fluid" style="margin-top: 12px">

                <!--Bot apiSecretKey-->
                <label for="name1" style="font-weight: 700">{{ $t('apiSecretKey') }}</label>
                <Dropdown class="mb-2" style="margin-top: 8px" id="apiKey" v-model="currentBot.apiKeyType" :options="apiKeyTypes" optionLabel="title" option-value="code" :placeholder="t('chooseOption')" option-disabled="disabled"></Dropdown>
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

            <TabPanel :header="`2.${t('prompt')}`">
              <div class="card-form p-fluid" style="margin-top: 16px">
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

                <!--Bot helloOnFirst-->
                <span class="bot-card__activate">
                  {{ $t('welcomeMessageStart') }}
                  <InputSwitch v-model="currentBot.hello_on_first" style="margin-left: 8px"/>
                </span>

                <!--Bot helloOnFirst-->
                <div v-if="currentBot.hello_on_first" class="card-form p-fluid">
                  <div class="field" style="margin-top: 12px">
                    <Textarea :placeholder="t('autoMessageNote')" :autoResize="true" rows="3" cols="30" v-model="currentBot.helloMessage" />
                  </div>
                </div>


                <!--Bot Tasks-->
<!--                <pre>{{ botFunctions }}</pre>-->
                <div v-if="botFunctions" class="mt-5">
                  <div v-for="(botFunction, index) in botFunctions" :key="index">
                    <Badge :value="index + 1" size="large" style="background-color: #F9753E; border: none;"></Badge>
                    <div class="mt-3 mb-4 flex flex-column gap-3">
                      <div class="flex flex-column gap-2">
                        <div class="flex justify-content-between w-full align-items-center mb-4">
                          <label style="font-weight: 700">{{ $t('botTask') }}</label>
                          <i class="pi pi-trash ml-auto " style="cursor: pointer; color: #EE9186; font-size: 18px" @click="showFuctionDeleteModal = true"></i>
                          <Dialog v-model:visible="showFuctionDeleteModal" :header="'Удалить задачу бота?'">
                            <span class="text-surface-500 dark:text-surface-400 block mb-4">Вы действительно хотите удалить эту задачу?</span>
                            <div class="flex justify-content-center gap-2 w-full">
                              <Button type="button" :label="t('delete')" severity="danger" @click="deleteFunction(index)"></Button>
                              <Button type="button" :label="t('cancel')" @click="showFuctionDeleteModal = false"></Button>
                            </div>
                          </Dialog>
                        </div>
                        <Textarea rows="3" cols="30" v-model="botFunction.prompt" />
                      </div>
                      <span style="font-weight: 700">{{ $t('actionsAfterTask') }}</span>
                      <span class="bot-card__activate">
                        {{ $t('endDialogue') }}
                        <InputSwitch v-model="interruptDialogue" style="margin-left: 24px"/>
                      </span>
                      <TabView class="mb-5">
                        <!--Send FileInMessage-->
                        <TabPanel :header="t('sendFileInMessage')">
                          <div class="mt-4 flex flex-column gap-4">
                            <span>{{ $t('fileSendingRestrictions') }}</span>
                            <div class="flex gap-3 align-items-center manage-files">
                              <Button :label="t('attachFile')" icon="pi pi-plus" class="file-btn" @click="openFileUploader(index)"></Button>
                              <input :id="`file-upload-${index}`" hidden type="file" @input="addFile($event, index)">
                              <span>{{ $t('maxFileSize5MB') }}</span>
                            </div>
                            <div v-if="botFunction?.actions?.filter((action) => action?.name === 'send_file')?.length" class="files">
                              <div class="flex flex-column gap-3" v-for="(file, fileIndex) in botFunction?.actions?.filter((action) => action?.name === 'send_file')" :key="fileIndex">
                                <div v-if="file?.parameters?.fileName">
                                  <BaseFile :type="file?.parameters?.type" :file-name="file?.parameters?.fileName" :picture="`https://api.7sales.ai/public/${file?.parameters?.fileName}`" @delete="showFileDeleteModal = true" />
                                </div>
                                <Dialog v-model:visible="showFileDeleteModal" :header="'Удалить файла'">
                                  <span class="text-surface-500 dark:text-surface-400 block mb-4">Вы точно хотите удалить этого файла?</span>
                                  <div class="flex justify-content-center gap-2 w-full">
                                    <Button type="button" :label="t('delete')" severity="danger" @click="deleteFunctionSendFile(file, index, fileIndex)"></Button>
                                    <Button type="button" :label="t('cancel')" @click="showFileDeleteModal = false"></Button>
                                  </div>
                                </Dialog>
                              </div>
                            </div>
                          </div>
                        </TabPanel>


                        <TabPanel :header="t('crmSystemManagement')">
                          <h5 class="mt-4">{{ $t('changeDealStage') }}</h5>

                          <div class="mt-4 flex justify-content-between gap-4 fields">
                            <div class="flex flex-column w-full gap-2">
                              <label for="funnel">{{ $t('choosePipeline') }}:</label>
                              <Dropdown style="margin-top: 8px" id="funnel" :model-value="getFunnelId(<number>index).value" @update:model-value="getFunnelId(<number>index).value = $event" :options="funnels" optionLabel="name" option-value="id" :placeholder="t('chooseField')"></Dropdown>
                            </div>
                            <div class="flex flex-column w-full gap-2">
                              <label for="statusId">{{ $t('changeStatus') }}:</label>
                              <Dropdown style="margin-top: 8px" id="statusId" :model-value="getStatusId(<number>index).value" @update:model-value="getStatusId(<number>index).value = $event" :options="funnels?.find((funnel) => funnel?.id === botFunction?.actions?.find((action) => action?.name === 'move_in_pipeline')?.parameters?.pipeline_id)?._embedded?.statuses" optionLabel="name" option-value="id" :placeholder="t('chooseField')"></Dropdown>
                            </div>
                          </div>
                          <div class="flex flex-column mt-3">
                            <label for="writeDealNote" style="font-weight: 700; margin-bottom: 12px;">{{ $t('writeDealNote') }}</label>
                            <Textarea :placeholder="t('dealNoteText')" :autoResize="true" rows="3" cols="2" :model-value="getDealNoteText(<number>index).value" @update:model-value="getDealNoteText(<number>index).value = $event" />
                          </div>
                          <div class="flex flex-column mt-3">
                            <label for="setFieldValue" style="font-weight: 700; margin-bottom: 12px;">{{ $t('setFieldValue') }}</label>
                            <div class="flex align-items-center gap-4 fields">
                              <div class="flex flex-column gap-2 w-full">
                                <label for="chooseField">{{ $t('chooseField') }}</label>
                                <Dropdown id="funnel" :model-value="getFieldId(<number>index).value" @update:model-value="getFieldId(<number>index).value = $event" :options="fields" optionLabel="name" option-value="id" placeholder="Выберите один"></Dropdown>
                              </div>
                              <div class="flex flex-column gap-2 w-full">
                                <label for="enterFieldValue">{{ $t('enterFieldValue') }}</label>
                                <InputText id="enterFieldValue" type="text" :model-value="getFieldValue(<number>index).value" @update:model-value="getFieldValue(<number>index).value = $event"   />
                              </div>
                            </div>
                          </div>
                        </TabPanel>

                        <TabPanel :header="t('sendNotification')">
                          <div class="flex flex-column gap-3">
                            <span style="font-weight: 700" class="mt-5">{{ $t('notificationText') }}</span>
                            <Textarea :autoResize="true" rows="3" cols="2" :model-value="getNotifyOperatorText(<number>index).value" @update:model-value="getNotifyOperatorText(<number>index).value = $event" />
                          </div>
                        </TabPanel>

                        <TabPanel :header="t('sendWebhook')">
                          <div class="flex flex-column gap-3">
                            <div class="flex flex-column gap-2 mt-5">
                              <span style="font-weight: 700">URL</span>
                              <InputText style="margin-bottom: 8px" id="webhookUrl" type="text" :model-value="getWebhookUrl(<number>index).value" @update:model-value="getWebhookUrl(<number>index).value = $event"  />
                            </div>
                            <div class="flex flex-column gap-2">
                              <span style="font-weight: 700">{{ $t('text')}}</span>
                              <Textarea rows="3" cols="30" :model-value="getWebhookText(<number>index).value" @update:model-value="getWebhookText(<number>index).value = $event" />
                            </div>
                          </div>
                        </TabPanel>

                      </TabView>
                    </div>
                  </div>
                  <Button :label="t('addTask')" style="background-color: #F9753E; border: none" class="add-btn" @click="addTask"/>
                </div>
              </div>
            </TabPanel>

            <TabPanel :header="`3.${t('channels')}`">
              <div class="mt-3" v-if="!allChannels.length">
                <Button :label="t('creatingChannel')" @click="createChannel"></Button>
              </div>

              <div class="chanel-list" v-if="connectedChannels.length">
                <h5 class="font-bold mb-2">{{ $t('connectedChannelsToBot') }}</h5>
                <span class="chanel-list__item" v-for="channel in connectedChannels" :key="channel._id">
                   <span class="mr-2">
                      <i v-if="channel.type === 'telegram'" style="color: #3B82F6; font-size: 27px" class="pi pi-telegram" />
                      <i v-if="channel.type === 'whatsapp'" style="color: #22c55e; font-size: 27px" class="pi pi-whatsapp" />
                      <span v-if="channel.type === 'avito'" style="width: 30px">
                <svg width="30px" height="30px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="140" r="40" fill="#59ff59"/>
                  <circle cx="140" cy="140" r="30" fill="#ff5959"/>
                  <circle cx="140" cy="80" r="50" fill="#59a1ff"/>
                  <circle cx="80" cy="60" r="20" fill="#a159ff"/>
                </svg>
              </span>
                      <span v-if="channel.type === 'amocrm'" style="width: 30px">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 30 30" version="1.1">
<defs>
<filter id="alpha" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
  <feColorMatrix type="matrix" in="SourceGraphic" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
</filter>
<mask id="mask0">
  <g filter="url(#alpha)">
<rect x="0" y="0" width="30" height="30" style="fill:rgb(0%,0%,0%);fill-opacity:0.913725;stroke:none;"/>
  </g>
</mask>
<clipPath id="clip1">
  <rect x="0" y="0" width="30" height="30"/>
</clipPath>
<g id="surface5" clip-path="url(#clip1)">
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(96.862745%,98.431373%,99.215686%);fill-opacity:1;" d="M 12.359375 0.972656 C 20.851562 0.421875 26.265625 4.21875 28.609375 12.359375 C 29.292969 20.855469 25.542969 26.273438 17.359375 28.609375 C 8.863281 29.292969 3.449219 25.542969 1.109375 17.359375 C 0.460938 8.839844 4.210938 3.378906 12.359375 0.972656 Z M 12.359375 0.972656 "/>
</g>
</defs>
<g id="surface1">
<use xlink:href="#surface5" mask="url(#mask0)"/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(21.960784%,60.784314%,82.352941%);fill-opacity:1;" d="M 24.027344 5.972656 C 23.675781 6.496094 23.167969 6.773438 22.5 6.804688 C 17.027344 6.609375 11.5625 6.609375 6.109375 6.804688 C 5.753906 6.570312 5.800781 6.246094 6.25 5.832031 C 6.1875 5.722656 6.09375 5.675781 5.972656 5.695312 C 11.085938 1.34375 16.546875 0.925781 22.359375 4.445312 C 22.886719 5.019531 23.445312 5.527344 24.027344 5.972656 Z M 24.027344 5.972656 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(18.039216%,58.431373%,81.176471%);fill-opacity:1;" d="M 5.972656 5.695312 C 6.09375 5.675781 6.1875 5.722656 6.25 5.832031 C 5.800781 6.246094 5.753906 6.570312 6.109375 6.804688 C 11.5625 6.609375 17.027344 6.609375 22.5 6.804688 C 23.167969 6.773438 23.675781 6.496094 24.027344 5.972656 C 26.746094 8.632812 27.902344 11.875 27.5 15.695312 C 27.21875 15.925781 26.894531 16.019531 26.527344 15.972656 C 27.019531 13.636719 26.183594 12.847656 24.027344 13.609375 C 23.261719 14.738281 23.355469 15.804688 24.304688 16.804688 C 22.226562 17.269531 21.535156 16.4375 22.222656 14.304688 C 23.105469 13.191406 24.261719 12.636719 25.695312 12.640625 C 23 11.207031 21.148438 11.945312 20.140625 14.859375 C 20.046875 14.859375 19.953125 14.859375 19.859375 14.859375 C 20.230469 12.777344 19.398438 11.992188 17.359375 12.5 C 17.125 12.785156 16.847656 13.015625 16.527344 13.195312 C 15.71875 11.613281 14.652344 11.429688 13.332031 12.640625 C 13.15625 12.136719 12.832031 11.769531 12.359375 11.527344 C 11.746094 11.921875 11.328125 12.480469 11.109375 13.195312 C 10.804688 14.28125 10.621094 15.394531 10.554688 16.527344 C 10.273438 16.761719 9.949219 16.851562 9.582031 16.804688 C 9.453125 15.441406 9.640625 14.144531 10.140625 12.917969 C 10.132812 12.492188 9.945312 12.167969 9.582031 11.945312 C 8.515625 11.902344 7.40625 11.902344 6.25 11.945312 C 5.269531 12.601562 4.4375 13.386719 3.75 14.304688 C 3.769531 14.183594 3.722656 14.089844 3.609375 14.027344 C 3.414062 14.4375 3.089844 14.621094 2.640625 14.582031 C 2.683594 13.929688 2.636719 13.28125 2.5 12.640625 C 2.359375 14.023438 2.316406 15.414062 2.359375 16.804688 C 1.554688 12.46875 2.757812 8.765625 5.972656 5.695312 Z M 5.972656 5.695312 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(16.470588%,56.862745%,80.392157%);fill-opacity:1;" d="M 7.359375 12.917969 C 7.6875 12.855469 7.964844 12.949219 8.195312 13.195312 C 7.984375 14.105469 7.847656 15.03125 7.777344 15.972656 C 7.210938 17.085938 6.46875 17.273438 5.554688 16.527344 C 5.417969 14.949219 6.019531 13.746094 7.359375 12.917969 Z M 7.359375 12.917969 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(29.411765%,62.352941%,82.745098%);fill-opacity:1;" d="M 25.140625 14.304688 C 25.457031 14.386719 25.644531 14.617188 25.695312 15 C 25.601562 15.230469 25.507812 15.464844 25.417969 15.695312 C 25.152344 15.265625 25.058594 14.800781 25.140625 14.304688 Z M 25.140625 14.304688 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(55.686275%,75.686275%,89.019608%);fill-opacity:1;" d="M 19.859375 14.859375 C 19.953125 14.859375 20.046875 14.859375 20.140625 14.859375 C 20.222656 15.535156 20.132812 16.183594 19.859375 16.804688 C 19.5 16.117188 19.5 15.46875 19.859375 14.859375 Z M 19.859375 14.859375 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(14.117647%,55.686275%,79.607843%);fill-opacity:1;" d="M 3.75 14.304688 C 2.769531 17.253906 3.785156 18.59375 6.804688 18.332031 C 7.300781 18.117188 7.71875 17.792969 8.054688 17.359375 C 8.488281 18.441406 9.226562 18.71875 10.277344 18.195312 C 10.980469 18.90625 11.671875 18.90625 12.359375 18.195312 C 12.589844 17.09375 12.730469 15.984375 12.777344 14.859375 C 12.9375 13.96875 13.445312 13.507812 14.304688 13.472656 C 14.257812 15.140625 14.304688 16.808594 14.445312 18.472656 C 14.96875 18.710938 15.476562 18.617188 15.972656 18.195312 C 15.707031 16.613281 16.078125 15.179688 17.082031 13.890625 C 17.347656 13.753906 17.625 13.707031 17.917969 13.75 C 17.886719 14.679688 17.792969 15.605469 17.640625 16.527344 C 17.613281 17.203125 17.796875 17.804688 18.195312 18.332031 C 19.011719 18.433594 19.796875 18.292969 20.554688 17.917969 C 21.738281 18.46875 22.988281 18.609375 24.304688 18.332031 C 25.144531 17.492188 26.160156 17.167969 27.359375 17.359375 C 27.214844 18.480469 26.84375 19.5 26.25 20.417969 C 26.023438 20.160156 25.792969 19.878906 25.554688 19.582031 C 18.496094 19.882812 11.367188 19.882812 4.167969 19.582031 C 3.800781 19.757812 3.570312 20.035156 3.472656 20.417969 C 2.804688 19.332031 2.4375 18.128906 2.359375 16.804688 C 2.316406 15.414062 2.359375 14.023438 2.5 12.640625 C 2.636719 13.28125 2.683594 13.929688 2.640625 14.582031 C 3.089844 14.621094 3.414062 14.4375 3.609375 14.027344 C 3.722656 14.089844 3.769531 14.183594 3.75 14.304688 Z M 3.75 14.304688 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(7.058824%,53.333333%,78.431373%);fill-opacity:1;" d="M 26.25 20.417969 C 25.910156 21.402344 25.355469 22.234375 24.582031 22.917969 C 18.101562 22.546875 11.621094 22.546875 5.140625 22.917969 C 4.367188 22.234375 3.8125 21.402344 3.472656 20.417969 C 3.570312 20.035156 3.800781 19.757812 4.167969 19.582031 C 11.367188 19.882812 18.496094 19.882812 25.554688 19.582031 C 25.792969 19.878906 26.023438 20.160156 26.25 20.417969 Z M 26.25 20.417969 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(7.45098%,51.764706%,77.647059%);fill-opacity:1;" d="M 24.582031 22.917969 C 22.039062 26.15625 18.660156 27.730469 14.445312 27.640625 C 10.578125 27.488281 7.476562 25.914062 5.140625 22.917969 C 11.621094 22.546875 18.101562 22.546875 24.582031 22.917969 Z M 24.582031 22.917969 "/>
</g>
</svg>
          </span>
                   </span>
                  {{ channel.title }}
                  <span class="ml-auto" style="color: #19C927">{{ $t('connected') }}</span>
                  <InputSwitch style="margin-left: 30px" v-model="channel.connected" @change="disconnectToBot(channel._id)"  />
                </span>
              </div>

              <div class="chanel-list" v-if="availableChannels.length">
                <h5 class="font-bold mb-2">{{ $t('availableChannels') }}</h5>
                <span class="chanel-list__item" v-for="channel in availableChannels" :key="channel._id">
                   <span class="mr-2">
                      <i v-if="channel.type === 'telegram'" style="color: #3B82F6; font-size: 27px" class="pi pi-telegram" />
                      <i v-if="channel.type === 'whatsapp'" style="color: #22c55e; font-size: 27px" class="pi pi-whatsapp" />
                      <span v-if="channel.type === 'avito'" style="width: 30px">
                         <svg width="30px" height="30px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                         <circle cx="60" cy="140" r="40" fill="#59ff59"/>
                        <circle cx="140" cy="140" r="30" fill="#ff5959"/>
                        <circle cx="140" cy="80" r="50" fill="#59a1ff"/>
                        <circle cx="80" cy="60" r="20" fill="#a159ff"/>
                        </svg>
                        </span>
                      <span v-if="channel.type === 'amocrm'" style="width: 30px">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 30 30" version="1.1">
                          <defs>
                            <filter id="alpha" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
                              <feColorMatrix type="matrix" in="SourceGraphic" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
                            </filter>
                            <mask id="mask0">
                              <g filter="url(#alpha)">
                                <rect x="0" y="0" width="30" height="30" style="fill:rgb(0%,0%,0%);fill-opacity:0.913725;stroke:none;"/>
                              </g>
                            </mask>
                            <clipPath id="clip1">
                              <rect x="0" y="0" width="30" height="30"/>
                            </clipPath>
                            <g id="surface5" clip-path="url(#clip1)">
                              <path style=" stroke:none;fill-rule:evenodd;fill:rgb(96.862745%,98.431373%,99.215686%);fill-opacity:1;" d="M 12.359375 0.972656 C 20.851562 0.421875 26.265625 4.21875 28.609375 12.359375 C 29.292969 20.855469 25.542969 26.273438 17.359375 28.609375 C 8.863281 29.292969 3.449219 25.542969 1.109375 17.359375 C 0.460938 8.839844 4.210938 3.378906 12.359375 0.972656 Z M 12.359375 0.972656 "/>
                            </g>
                          </defs>
                          <g id="surface1">
                            <use xlink:href="#surface5" mask="url(#mask0)"/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(21.960784%,60.784314%,82.352941%);fill-opacity:1;" d="M 24.027344 5.972656 C 23.675781 6.496094 23.167969 6.773438 22.5 6.804688 C 17.027344 6.609375 11.5625 6.609375 6.109375 6.804688 C 5.753906 6.570312 5.800781 6.246094 6.25 5.832031 C 6.1875 5.722656 6.09375 5.675781 5.972656 5.695312 C 11.085938 1.34375 16.546875 0.925781 22.359375 4.445312 C 22.886719 5.019531 23.445312 5.527344 24.027344 5.972656 Z M 24.027344 5.972656 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(18.039216%,58.431373%,81.176471%);fill-opacity:1;" d="M 5.972656 5.695312 C 6.09375 5.675781 6.1875 5.722656 6.25 5.832031 C 5.800781 6.246094 5.753906 6.570312 6.109375 6.804688 C 11.5625 6.609375 17.027344 6.609375 22.5 6.804688 C 23.167969 6.773438 23.675781 6.496094 24.027344 5.972656 C 26.746094 8.632812 27.902344 11.875 27.5 15.695312 C 27.21875 15.925781 26.894531 16.019531 26.527344 15.972656 C 27.019531 13.636719 26.183594 12.847656 24.027344 13.609375 C 23.261719 14.738281 23.355469 15.804688 24.304688 16.804688 C 22.226562 17.269531 21.535156 16.4375 22.222656 14.304688 C 23.105469 13.191406 24.261719 12.636719 25.695312 12.640625 C 23 11.207031 21.148438 11.945312 20.140625 14.859375 C 20.046875 14.859375 19.953125 14.859375 19.859375 14.859375 C 20.230469 12.777344 19.398438 11.992188 17.359375 12.5 C 17.125 12.785156 16.847656 13.015625 16.527344 13.195312 C 15.71875 11.613281 14.652344 11.429688 13.332031 12.640625 C 13.15625 12.136719 12.832031 11.769531 12.359375 11.527344 C 11.746094 11.921875 11.328125 12.480469 11.109375 13.195312 C 10.804688 14.28125 10.621094 15.394531 10.554688 16.527344 C 10.273438 16.761719 9.949219 16.851562 9.582031 16.804688 C 9.453125 15.441406 9.640625 14.144531 10.140625 12.917969 C 10.132812 12.492188 9.945312 12.167969 9.582031 11.945312 C 8.515625 11.902344 7.40625 11.902344 6.25 11.945312 C 5.269531 12.601562 4.4375 13.386719 3.75 14.304688 C 3.769531 14.183594 3.722656 14.089844 3.609375 14.027344 C 3.414062 14.4375 3.089844 14.621094 2.640625 14.582031 C 2.683594 13.929688 2.636719 13.28125 2.5 12.640625 C 2.359375 14.023438 2.316406 15.414062 2.359375 16.804688 C 1.554688 12.46875 2.757812 8.765625 5.972656 5.695312 Z M 5.972656 5.695312 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(16.470588%,56.862745%,80.392157%);fill-opacity:1;" d="M 7.359375 12.917969 C 7.6875 12.855469 7.964844 12.949219 8.195312 13.195312 C 7.984375 14.105469 7.847656 15.03125 7.777344 15.972656 C 7.210938 17.085938 6.46875 17.273438 5.554688 16.527344 C 5.417969 14.949219 6.019531 13.746094 7.359375 12.917969 Z M 7.359375 12.917969 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(29.411765%,62.352941%,82.745098%);fill-opacity:1;" d="M 25.140625 14.304688 C 25.457031 14.386719 25.644531 14.617188 25.695312 15 C 25.601562 15.230469 25.507812 15.464844 25.417969 15.695312 C 25.152344 15.265625 25.058594 14.800781 25.140625 14.304688 Z M 25.140625 14.304688 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(55.686275%,75.686275%,89.019608%);fill-opacity:1;" d="M 19.859375 14.859375 C 19.953125 14.859375 20.046875 14.859375 20.140625 14.859375 C 20.222656 15.535156 20.132812 16.183594 19.859375 16.804688 C 19.5 16.117188 19.5 15.46875 19.859375 14.859375 Z M 19.859375 14.859375 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(14.117647%,55.686275%,79.607843%);fill-opacity:1;" d="M 3.75 14.304688 C 2.769531 17.253906 3.785156 18.59375 6.804688 18.332031 C 7.300781 18.117188 7.71875 17.792969 8.054688 17.359375 C 8.488281 18.441406 9.226562 18.71875 10.277344 18.195312 C 10.980469 18.90625 11.671875 18.90625 12.359375 18.195312 C 12.589844 17.09375 12.730469 15.984375 12.777344 14.859375 C 12.9375 13.96875 13.445312 13.507812 14.304688 13.472656 C 14.257812 15.140625 14.304688 16.808594 14.445312 18.472656 C 14.96875 18.710938 15.476562 18.617188 15.972656 18.195312 C 15.707031 16.613281 16.078125 15.179688 17.082031 13.890625 C 17.347656 13.753906 17.625 13.707031 17.917969 13.75 C 17.886719 14.679688 17.792969 15.605469 17.640625 16.527344 C 17.613281 17.203125 17.796875 17.804688 18.195312 18.332031 C 19.011719 18.433594 19.796875 18.292969 20.554688 17.917969 C 21.738281 18.46875 22.988281 18.609375 24.304688 18.332031 C 25.144531 17.492188 26.160156 17.167969 27.359375 17.359375 C 27.214844 18.480469 26.84375 19.5 26.25 20.417969 C 26.023438 20.160156 25.792969 19.878906 25.554688 19.582031 C 18.496094 19.882812 11.367188 19.882812 4.167969 19.582031 C 3.800781 19.757812 3.570312 20.035156 3.472656 20.417969 C 2.804688 19.332031 2.4375 18.128906 2.359375 16.804688 C 2.316406 15.414062 2.359375 14.023438 2.5 12.640625 C 2.636719 13.28125 2.683594 13.929688 2.640625 14.582031 C 3.089844 14.621094 3.414062 14.4375 3.609375 14.027344 C 3.722656 14.089844 3.769531 14.183594 3.75 14.304688 Z M 3.75 14.304688 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(7.058824%,53.333333%,78.431373%);fill-opacity:1;" d="M 26.25 20.417969 C 25.910156 21.402344 25.355469 22.234375 24.582031 22.917969 C 18.101562 22.546875 11.621094 22.546875 5.140625 22.917969 C 4.367188 22.234375 3.8125 21.402344 3.472656 20.417969 C 3.570312 20.035156 3.800781 19.757812 4.167969 19.582031 C 11.367188 19.882812 18.496094 19.882812 25.554688 19.582031 C 25.792969 19.878906 26.023438 20.160156 26.25 20.417969 Z M 26.25 20.417969 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(7.45098%,51.764706%,77.647059%);fill-opacity:1;" d="M 24.582031 22.917969 C 22.039062 26.15625 18.660156 27.730469 14.445312 27.640625 C 10.578125 27.488281 7.476562 25.914062 5.140625 22.917969 C 11.621094 22.546875 18.101562 22.546875 24.582031 22.917969 Z M 24.582031 22.917969 "/>
                          </g>
                        </svg>
                      </span>
                   </span>
                  {{ channel.title }}
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
              <div class="table-container">
                <TreeTable v-model:selectionKeys="knowledgeBaseSelectedKey" :value="files" selectionMode="checkbox" tableStyle="min-width: 100rem">
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
                  <Column field="notification" :header="t('reminders')">
                    <template #body="slotProps">
                      <div>
                        <i class="pi pi-check-circle"></i>
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
                    <Button severity="secondary" raised :label="t('subscribe')" class="mt-3 connect-btn" @click="openTelegram"/>
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
                  <div class="flex align-items-end webhooks">
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

      <div v-if="chatVisible" class="chat">
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
.connect-btn {
  width: 30%
}
/* Media query for smaller screens (e.g., mobile devices) */
@media (max-width: 601px) {
  .bot-list {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .connect-btn {
    width: 100%
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
  @supports (height: 100dvh) {
    .layout-chat {
      height: calc(100dvh - 70px) !important;
    }

  }
  .webhooks {
    flex-direction: column !important;
    gap: 16px;
  }
  .json-snippet {
    width: 100% !important;
  }
  :deep(.p-treetable) {
    width: 100%;
    min-width: 800px; /* Adjust this to your needs */
  }
  .table-container {
    width: 100%;
    overflow-x: scroll;
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
.table-container {
  overflow-x: auto;
}
.add-btn {
  width: 25%
}
.file-btn {
  width: 25%
}
@media (max-width: 601px) {
  .add-btn {
    width: 100% !important;
  }
  .manage-files {
    flex-direction: column;
    align-items: flex-start !important;
  }
  .file-btn {
    width: 100% !important;
  }
}
.image {
  width: 150px;
  height: 100px;
  object-fit: contain;
}

.files {
  display: grid;
  grid-template-columns: repeat(5, minmax(0,150px));
  gap: 16px;
}
</style>