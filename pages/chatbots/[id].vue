<script setup lang="ts">
import {useBotStore} from "~/src/shared/store/bot";
import {useChannelStore} from "~/src/shared/store/channel";
import {useKnowledgeStore} from "~/src/shared/store/knowledge";
import {useMainStore} from "~/src/shared/store/main";
import {useNotificationStore} from "~/src/shared/store/notification";
import {useToast} from "primevue/usetoast";
import {useLayout} from '~/composable';
import {useAmoCrmStore} from "~/src/shared/store/amocrm";
import {useBitrix24} from "~/src/shared/store/bitrix24";
import {useLoaderStore} from "~/src/shared/store/loader";
import {useBotReminder} from "~/src/shared/store/reminder";
import {useUserStore} from "~/src/shared/store/user";
import {convertTimeToTimezone, convertToBrowserTimezone, convertToTimeZone} from "~/src/shared/utils/helpers";
import {BotGeneralSettings} from "~/src/features/bot-general-settings";
import {BotGeneralChannels} from "~/src/features/bot-general-channels";
import {BotGeneralKnowledge} from "~/src/features/bot-general-knowledge";
import {BotGeneralNotification} from "~/src/features/bot-general-notification/index";
import {BotGeneralReminders} from "~/src/features/bot-general-reminders";
import {BotChat} from "~/src/features/bot-chat";
import {BotGeneralPromt} from "~/src/features/bot-general-promt";

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
const route = useRoute();


const botStore = useBotStore();
const channelStore = useChannelStore();
const knowledgeStore = useKnowledgeStore();
const mainStore = useMainStore();
const notificationStore = useNotificationStore();
const amoCrmStore = useAmoCrmStore();
const bitrix24Store = useBitrix24();
const loaderStore = useLoaderStore();
const botReminderStore = useBotReminder();
const userStore = useUserStore();


const loading = computed(() => {
  return loaderStore.getLoading;
})


const { t } = useI18n();


const apiKey = ref({
  title: 'Использовать отдельный токен для этого бота',
  code: 'individual_token'
});

const model = ref(null);


const workingZones = computed(() => {
  return botReminderStore.getAllTimeZones;
})


const active = ref(true)

const message = ref<string>('')

const channelStatus = ref('');

const funnelInAmoCRM = ref(null);

const currentBot = ref({
  _id: '',
  user_id: '',
  instructions: '',
  apiKey: '',
  apiKeyType: 'own',
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
  channels: [],
  messageLimit: {
    qty: 30,
    period: 1,
    granularity: 'day',
  },
  model: 'gpt-4o',
  name: '',
  operatorStopTime: 20,
  schedule: {
    timezone: '',
    isSchedule: false,
    workingHours: []
  },
  smallTimeout: 10,
  stopOnOperator: false,
  temperature: 0.5,
  whisper: false,
});

const isValidatedApiSecretKey = computed(() => {
  if (currentBot.value.apiKeyType === 'shared') {
    return userBalance.value <= 0;
  } else {
    return currentBot.value.apiKey.length <= 3;
  }
})

const workingHours = ref([
  {
    title: 'ПН',
    start: '00:00',
    end: '23:59',
    isWork: true
  },
  {
    title: 'ВТ',
    start: '00:00',
    end: '23:59',
    isWork: true
  },
  {
    title: 'СР',
    start: '00:00',
    end: '23:59',
    isWork: true
  },
  {
    title: 'ЧТ',
    start: '00:00',
    end: '23:59',
    isWork: true
  },
  {
    title: 'ПТ',
    start: '00:00',
    end: '23:59',
    isWork: true
  },
  {
    title: 'СБ',
    start: '00:00',
    end: '23:59',
    isWork: true
  },
  {
    title: 'ВС',
    start: '00:00',
    end: '23:59',
    isWork: true
  },
])

function getUTCOffsetString() {
  const offsetMinutes = new Date().getTimezoneOffset();
  const offsetHours = -(offsetMinutes / 60);

  const fraction = offsetHours % 1;
  let hourString = `utc${offsetHours >= 0 ? '+' : ''}${Math.trunc(offsetHours)}`;

  if (fraction !== 0) {
    const minutes = Math.abs(fraction * 60);
    hourString += `_${minutes}`;
  }

  return hourString;
}

const telegramLink = ref<string>('')

// function ensureAllActionsExist(botFunction: any) {
//   const requiredActions = [
//     {
//       name: 'send_file',
//       parameters: {
//         fileName: null,
//         type: null
//       }
//     },
//     {
//       name: 'send_webhook',
//       parameters: {
//         webhook_url: '',
//         webhook_text: ''
//       }
//     },
//     {
//       name: 'notify_operator',
//       parameters: {
//         text: ''
//       }
//     },
//     {
//       name: 'edit_crm_fields',
//       parameters: {
//         fields: []
//       }
//     },
//     {
//       name: 'add_note',
//       parameters: {
//         text: ''
//       }
//     },
//     {
//       name: 'move_in_pipeline',
//       parameters: {
//         pipeline_id: '',
//         status_id: ''
//       }
//     },
//     {
//       name: 'send_to_webhook',
//       parameters: {
//         url: '',
//         method: undefined,
//         isOn: true,
//         queryParams: [],
//         headers: [],
//         bodyParams: []
//       }
//     }
//   ];
//
//   requiredActions.forEach(requiredAction => {
//     const exists = botFunction.actions.some(action => action?.name === requiredAction.name);
//     if (!exists) {
//       botFunction.actions.push({ ...requiredAction });
//     }
//   });
//
//   return botFunction;
// }

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
      name: 'edit_crm_fields',
      parameters: {
        fields: []
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
    },
    {
      name: 'send_to_webhook',
      parameters: {
        url: '',
        method: undefined,
        isOn: true,
        queryParams: [],
        headers: [],
        bodyParams: []
      }
    }
  ];

  requiredActions.forEach(requiredAction => {
    const existingAction = botFunction.actions.find(
        action => action?.name === requiredAction.name
    );

    if (!existingAction) {
      // If the action doesn't exist, add it with default parameters
      botFunction.actions.push({ ...requiredAction });
    } else if (requiredAction.name === 'edit_crm_fields') {
      // If it's the 'edit_crm_fields' action, process its parameters
      const parameters = existingAction.parameters || {};

      const fields = [];

      // Process lead_fields if they exist
      if (parameters.lead_fields) {
        const { lead_fields } = parameters;

        // Standard Fields
        if (lead_fields.standard_fields && Array.isArray(lead_fields.standard_fields)) {
          lead_fields.standard_fields.forEach((field: any) => {
            fields.push({
              ...field,
              category: 'lead_fields',
              type: 'standard_fields',
              field_values: field.value,
              field: field.field,
              code: field.code || '',
            });
          });
        }

        // Custom Fields
        if (lead_fields.custom_fields && Array.isArray(lead_fields.custom_fields)) {
          lead_fields.custom_fields.forEach((field: any) => {
            fields.push({
              ...field,
              category: 'lead_fields',
              type: 'custom_fields',
              field_values: field.values[0]?.value || '',
              field: field.field,
              code: field.code || '',
            });
          });
        }
      }

      // Process contact_fields if they exist
      if (parameters.contact_fields) {
        const { contact_fields } = parameters;

        // Standard Fields
        if (contact_fields.standard_fields && Array.isArray(contact_fields.standard_fields)) {
          contact_fields.standard_fields.forEach((field: any) => {
            fields.push({
              ...field,
              category: 'contact_fields',
              type: 'standard_fields',
              field_values: field.value,
              field: {
                name: field.name,
                rus_name: field.rus_name || '',
                eng_name: field.eng_name || '',
                entity_type: 'contacts',
                type: 'standard_fields',
                enums: field.enums || null,
                category: 'contact_fields',
              },
              code: field.code || '',
            });
          });
        }

        // Custom Fields
        if (contact_fields.custom_fields && Array.isArray(contact_fields.custom_fields)) {
          contact_fields.custom_fields.forEach((field: any) => {
            fields.push({
              category: 'contact_fields',
              type: 'custom_fields',
              field_values: field.values[0]?.value || '',
              field: {
                name: field.name || '',
                rus_name: field.rus_name || '',
                eng_name: field.eng_name || '',
                entity_type: 'contacts',
                type: 'custom_fields',
                enums: field.enums || null,
                category: 'contact_fields',
              },
              code: field.code || '',
              ...field,
            });
          });
        }
      }

      // Replace the parameters with the reconstructed fields array
      existingAction.parameters = {
        fields,
      };
    }
  });

  return botFunction;
}


const userBalance = computed(() => {
  return userStore.user?.balance
})

const showEmptyOpenAISecretKey = ref<string>(false)

onMounted(async () => {
  await Promise.all([
    amoCrmStore.fetchVoronki(),
    amoCrmStore.fetchAmoCrmFields(),
    botStore.getBot(<string>route.params.id).then(async (res) => {
      if (res?.channels?.some((channel) => channel.type === 'bitrix24')) {
        await bitrix24Store.loadFunnels(res?.channels?.find((channel) => channel.type === 'bitrix24')?.channelId);
        await  bitrix24Store.loadFields();
      }
      if (res?.functions) {
        botFunctions.value = res.functions.map(botFunction => ensureAllActionsExist(botFunction));
        res?.functions?.forEach((func,index) => {
          if (!func?.parameters?.length) {
            botFunctions.value[index].parameters = [];
          }
        })
      }

      Object.keys(currentBot.value).forEach(key => {
        if (key in res && res[key] !== null && res[key] !== undefined) {
          currentBot.value[key] = res[key];
        }
      });

      if (res?.reminders?.length) {
        reminders.value = res?.reminders?.map(item => {
          return {
            ...item,
            schedule: {
              start: item.schedule.start > 5 ? convertToTimeZone(item.schedule.start) : item.schedule.start,
              end: item.schedule.end > 5 ? convertToTimeZone(item.schedule.end) : item.schedule.end,
            }
          };
        })
      }


      if (res?.schedule?.workingHours?.length) {
        currentBot.value.schedule.workingHours = res?.schedule?.workingHours?.map(item => {
          return {
            ...item,
            start: item.start.length > 5 ? convertTimeToTimezone(item.start, res?.schedule?.timezone) : item.start,
            end: item.end.length > 5 ? convertTimeToTimezone(item.end, res?.schedule?.timezone) : item.end
          };
        })
      }

      if (!res?.schedule?.timezone) {
        currentBot.value.schedule.timezone = getUTCOffsetString();
      }
      if (!res?.schedule?.workingHours) {
        currentBot.value.schedule.workingHours = workingHours.value
      }
      if (res?.apiKeyType) {
        mainStore.setChatBotActiveTab(1);
      } else {
        mainStore.setChatBotActiveTab(0);
        showEmptyOpenAISecretKey.value = true
      }
    }),
    knowledgeStore.getKnowledgeListByBot(<string>route.params.id),
    notificationStore.getTelegramNotificationLink().then((res) => {
      const response = JSON.parse(res);
      telegramLink.value = response?.link;
    }),
    userStore.fetchUserInfo()
  ]);
});

const bot = computed(() => {
  return botStore.getCurrentBot
});

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
    // if (action.name === 'edit_crm_fields' && (!action.parameters.lead_fields.custom_fields[0].field_id || !action.parameters.lead_fields.standard_fields[0].name || !action.parameters.contact_fields.custom_fields[0].field_id || !action.parameters.contact_fields.standard_fields[0].name)) {
    if (action.name === 'edit_crm_fields' && !action.parameters.fields) {
      return false;
    }
    if (action.name === 'add_note' && !action.parameters.text) {
      return false;
    }
    return !(action.name === 'move_in_pipeline' && (!action.parameters.pipeline_id || !action.parameters.status_id));

  });
}

const confirmBotMainSettings = async () => {
  botFunctions.value = botFunctions.value.map((botFunction: any) => {
    // Filter empty actions first
    const filteredActions = filterEmptyActions(botFunction.actions);

    // Map over the actions to transform them
    const transformedActions = filteredActions.map((action: any) => {
      if (action.name === "edit_crm_fields") {
        // Initialize the lead_fields and contact_fields structures
        const lead_fields = {
          standard_fields: [] as any[],
          custom_fields: [] as any[],
        };
        const contact_fields = {
          standard_fields: [] as any[],
          custom_fields: [] as any[],
        };

        // Process each field in the action
        action.parameters.fields.forEach((field: any) => {
          const category = field.category; // "contact_fields" or "lead_fields"
          const type = field.type; // "standard_fields" or "custom_fields"
          let targetFields;

          if (category === "contact_fields") {
            targetFields = contact_fields;
          } else if (category === "lead_fields") {
            targetFields = lead_fields;
          } else {
            // Unknown category, skip or handle error
            return;
          }

          if (type === "standard_fields") {
            const newField = {
              kind: field.kind,
              ...field.field,
              ...field,
              value: field.field_values,
            };
            targetFields.standard_fields.push(newField);
          } else if (type === "custom_fields") {
            const newField = {
              ...field,
              field_id: field.field_id,
              code: field.code,
              enums: field.field.enums,
              kind: field.kind,
              values: [
                {
                  value: field.field_values,
                },
              ],
            };
            targetFields.custom_fields.push(newField);
          } else {
            // Unknown type, skip or handle error
            return;
          }
        });

        // Construct the new action with the transformed parameters
        return {
          name: action.name,
          parameters: {
            lead_fields,
            contact_fields,
          },
        };
      } else {
        // Return the action unchanged if it's not "edit_crm_fields"
        return action;
      }
    });

    // Create the new botFunction with transformed actions
    return {
      ...botFunction,
      actions: transformedActions,
    };
  });

  const botSetting = {
    ...currentBot.value,
    schedule: {
      ...currentBot.value.schedule,
      workingHours: currentBot.value.schedule.workingHours?.map((item) => ({
        isWork: item.isWork,
        title: item.title,
        start: typeof item.start === 'object' ? convertToTimeZone(item.start, currentBot.value.schedule.timezone) : item.start,
        end: typeof item.end === 'object' ? convertToTimeZone(item.end, currentBot.value.schedule.timezone) : item.end,
      }))
    }
  }


  await botStore.editBot(<string>route.params.id, botSetting).then(async (res) => {
    toast.add({ severity: 'success', summary: t('ready'), life: 5000 });
    console.log(reminders.value, 'reminders value')
    const botReminders = reminders.value?.map((reminder) => ({
      ...reminder,
      schedule: {
        start: reminder.schedule?.start
            ? typeof reminder.schedule.start === 'object'
                ? convertToTimeZone(reminder.schedule.start, 'utc+5')
                : reminder.schedule.start
            : null,
        end: reminder.schedule?.end
            ? typeof reminder.schedule.end === 'object'
                ? convertToTimeZone(reminder.schedule.end, 'utc+5')
                : reminder.schedule.end
            : null,
      }
    }));

    console.log(botReminders, 'reminders')
    if (reminders.value) {
      await botReminderStore.saveBotReminder(<string>route.params.id, botReminders)
    }
    if (countFunctionChanging.value > 1) {
      await botStore.saveFunctionById(<string>route.params.id, botFunctions.value)
    }
    if (res?.success) {
      await botStore.getBot(<string>route.params.id).then((res) => {
        if (res?.functions) {
          botFunctions.value = res.functions.map(botFunction => ensureAllActionsExist(botFunction));
        }

        Object.keys(currentBot.value).forEach(key => {
          if (key in res && res[key] !== null && res[key] !== undefined) {
            currentBot.value[key] = res[key];
          }
        });
        if (res?.schedule?.workingHours?.length) {
          currentBot.value.schedule.workingHours = res?.schedule?.workingHours?.map(item => {
            return {
              ...item,
              start: item.start.length > 5 ? convertTimeToTimezone(item.start, res?.schedule?.timezone) : item.start,
              end: item.end.length > 5 ? convertTimeToTimezone(item.end, res?.schedule?.timezone) : item.end
            };
          })
        }

      })
    }
  })

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

const webhookUrl = ref<string>('')

const botFunctions = ref<any>([])

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
            name: 'edit_crm_fields',
            parameters: {
              fields: []
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
          },
          {
            name: 'stop_dialogue'
          },
          {
            name: 'stop_reminder'
          },
          {
            name: 'send_to_webhook',
            parameters: {
              url: '',
              method: undefined,
              isOn: true,
              queryParams: [],
              headers: [],
              bodyParams: []
            }
          }
        ],
        parameters: [
          {
            name: '',
            type: 'string',
            description: '',
          }
        ]
      }
  )
}

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


const reminders = ref<{
  id: number,
  quantity: number,
  message: string,
  timeframe: string,
  type: string,
  isSchedule: boolean,
  isActiveReminder: boolean,
  schedule: {
    start?: string,
    end?: string
  }
}[]>([]);

const handleRemindersUpdate = (updatedReminders) => {
  reminders.value = updatedReminders;
};
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

  <Dialog v-model:visible="showEmptyOpenAISecretKey" modal header="Как правильно создать ИИ-бота" :style="{ width: '50rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-4" style="font-weight: 700;">1. Введите API Secret Key OpenAI в разделе 1.Общие.</span>
    <span class="text-surface-500 dark:text-surface-400 block mb-4">2. Сформулируйте промт и задачи для бота.</span>
    <span class="text-surface-500 dark:text-surface-400 block mb-4">3. Настройте напоминания для ваших клиентов.</span>
    <span class="text-surface-500 dark:text-surface-400 block mb-4">4. Подключите к боту нужные каналы.</span>
    <span class="text-surface-500 dark:text-surface-400 block mb-4">Сохраняйте изменения на каждом шаге.</span>
  </Dialog>

  <div class="grid">
    <div class="app-wrapper">
      <div class="card h-full flex flex-column w-full">
        <div class="flex justify-content-between">
          <h5>{{ $t('edit') }} "{{ bot?.name }}"</h5>
          <div class="flex align-items-center gap-4">
            <nuxt-link to="/chatbots" style="color: #334155">{{ $t('goBack')}}</nuxt-link>
            <Button :label="t('save')" @click="confirmBotMainSettings" :disabled="loading || isValidatedApiSecretKey"></Button>
          </div>
        </div>
        <div>
          <TabView v-model:activeIndex="mainStore.chatBotActiveTab">
            <TabPanel :header="`1.${t('general')}`">
              <BotGeneralSettings
                  :currentBot="currentBot"
                  :loading="loading"
                  :isValidatedApiSecretKey="isValidatedApiSecretKey"
                  :workingZones="workingZones"
                  @update:currentBot="currentBot = $event"
                  @confirmBotMainSettings="confirmBotMainSettings"
                  @removeBot="removeBot"
              />
            </TabPanel>

            <TabPanel :header="`2.${t('prompt')}`">
<!--              <Pre>{{ botFunctions }}</Pre>-->
              <BotGeneralPromt
                  :currentBot="currentBot"
                  :botFunctions="botFunctions"
                  @update:currentBot="currentBot = $event"
                  @addTask="addTask"
              />
            </TabPanel>

            <TabPanel :header="`3.${t('reminders')}`">
              <BotGeneralReminders
                  :reminders="reminders"
                  @update-reminders="handleRemindersUpdate"
              />
            </TabPanel>

            <TabPanel :header="`4.${t('channels')}`">
              <BotGeneralChannels />
            </TabPanel>

            <TabPanel :header="t('knowledgeBase')">
              <BotGeneralKnowledge />
            </TabPanel>

            <TabPanel :header="t('notifications')">
              <BotGeneralNotification />
            </TabPanel>
          </TabView>
        </div>
      </div>

      <BotChat v-if="chatVisible" :bot-name="bot?.name" :api-key-type="currentBot.apiKeyType" />
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

.add-btn {
  width: 25%
}
.file-btn {
  width: 25%;
  @media (max-width: 1530px) {
    width: 30% !important;
  }

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
  @media (max-width: 601px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  @media (max-width: 1530px) {
    grid-template-columns: repeat(3, minmax(0,150px));
  }
}

.task-wrapper {
  border: 1px solid #0f172a;
  border-radius: 6px;
  padding: 8px 0;
}
.task-panel {
  padding: 0 16px;
  @media (max-width: 1530px) {
    width: 100% !important;
    max-width: 640px;
  }
  @media (max-width: 601px) {
    width: 100% !important;
  }
}
.chat-header {
  border-bottom: 1px solid var(--surface-border);
  padding: 12px 8px 8px 8px;
}

.success-tab-title {
  color: #11B981;
}
</style>
