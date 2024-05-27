<script setup lang="ts">

const { t } = useI18n();

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

watchEffect(() => {
  console.log(route);
})

const usedValue = ref<boolean>(false);
const interruptDialogue = ref<boolean>(false);
const telegramNotification = ref<boolean>(false);

const funnels = ref([
  {
    title: 'Воронка 1',
    id: 'funnel1'
  },
  {
    title: 'Воронка 2',
    id: 'funnel2'
  },
  {
    title: 'Воронка 3',
    id: 'funnel3'
  },
  {
    title: 'Воронка 4',
    id: 'funnel4'
  },
  {
    title: 'Воронка 5',
    id: 'funnel5'
  }
]);

const funnelId = ref<string>('');

const statuses = ref([
  {
    title: 'В работе',
    id: 'inProcess'
  },
  {
    title: 'В ожидании',
    id: 'waiting'
  },
  {
    title: 'Готово',
    id: 'done'
  }
]);

const statusId = ref<string>('')

const isClientRemindersNewMessage = ref(false);

const timeList = ref([
  {
    id: 'perMinutes',
    title: t('perMinutes')
  },
  {
    id: 'perHour',
    title: t('perHour')
  },
  {
    id: 'perDay',
    title: t('perDay')
  }
]);
const timeItem = ref(null);

const selectedMessageTypes = ref([
  {
    id: 'sendMyMessage',
    title: t('sendMyMessage')
  },
  {
    id: 'generateUsingAI',
    title: t('generateUsingAI')
  }
])

const selectedMessage = ref(null);
const messages = ref<{ id: number }[]>([]);

const addMessage = () => {
  messages.value.push({ id: messages.value.length + 1})
}

const messageTypes = ref([
  {
    id: 'sendMyMessage',
    title: t('sendMyMessage')
  },
  {
    id: 'generateUsingAI',
    title: t('generateUsingAI')
  }
])
const messageType = ref(null);

const deleteMessage = (id: number) => {
  messages.value = messages.value.filter(message => message.id !== id);
}

</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <h5>{{ $t('editKnowledgeBaseFile') }} "{{ bots.find((bot) => bot.id === Number(route.params.id)).title }}"</h5>
        <div class="card-form p-fluid" style="margin-top: 16px">
          <div class="flex gap-3">
            <div class="field w-full">
              <label for="name1">{{ $t('nameWithin7s') }}</label>
              <InputText id="name1" type="text" />
            </div>
            <div class="field w-full">
              <label for="name1">{{ $t('nameForSearchOpenAI') }}</label>
              <InputText id="name1" type="text" />
            </div>
          </div>

        </div>

        <div class="flex items-center gap-8 mb-5">
          <span class="bot-card__activate">
            {{ $t('useBase') }}
            <InputSwitch v-model="usedValue" style="margin-left: 24px"/>
          </span>
          <span class="bot-card__activate">
            {{ $t('endDialogue') }}
            <InputSwitch v-model="interruptDialogue" style="margin-left: 24px"/>
          </span>
          <span class="bot-card__activate">
            {{ $t('sendNotification') }}
            <InputSwitch v-model="telegramNotification" style="margin-left: 24px"/>
          </span>
        </div>
        <div>
          <TabView>
            <TabPanel :header="t('fileContent')">
              <Textarea class="mt-4 w-full" :autoResize="true" rows="5" cols="30" :placeholder="t('botResponseInstructions')" />
            </TabPanel>
            <TabPanel :header="t('clientReminders')">
              <div v-if="messages?.length">
                <div v-for="(message, i) in messages" :key="i" class="mt-4 flex align-items-center gap-8">
                  <div class="flex flex-column" style="width: 700px">
                    <div>
                      <div class="text-xl">{{ message.id }}. {{ $t('clientMessage')}}</div>
                    </div>
                    <div class="flex align-items-center gap-3 ml-4 mt-4">
                      <span>{{ $t('clientNoResponseTime') }}</span>
                      <InputText id="name1" type="number" min="1" style="max-width: 70px" />
                      <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="timeItem" v-model="timeItem" :options="timeList" optionLabel="title"></Dropdown>
                    </div>
                    <Dropdown class="ml-4 mt-2 mb-2" id="messageType" v-model="messageType" :options="messageTypes" optionLabel="title" :placeholder="t('chooseOption')"></Dropdown>
                    <InputText class="ml-4 mt-4" id="purchaseDecision" type="text" :placeholder="t('purchaseDecision')" />
                    <Textarea class="ml-4 mt-4" id="analyzeLast5Messages" type="text" :placeholder="t('analyzeLast5Messages')" :autoResize="true" rows="1" cols="2" />
                    <i class="pi pi-trash ml-auto mt-3" style="cursor: pointer; color: #EE9186;" @click="deleteMessage(message.id)"></i>
                  </div>
                </div>
              </div>
              <Button :label="t('addMessage')" class="mt-4" @click="addMessage"/>
            </TabPanel>
            <TabPanel :header="t('sendFileInMessage')">
              <div class="mt-4 flex flex-column gap-4">
                <span>{{ $t('fileSendingRestrictions') }}</span>
                <div class="flex gap-3 align-items-center">
                  <Button :label="t('attachFile')" icon="pi pi-plus"></Button>
                  <Button :label="t('downloadFile')" icon="pi pi-upload"></Button>
                  <Button :label="t('deleteFile')" icon="pi pi-times"></Button>
                  <span>{{ $t('maxFileSize5MB') }}</span>
                </div>
              </div>
            </TabPanel>
            <TabPanel :header="t('crmSystemManagement')">
              <h5 class="mt-4">{{ $t('changeDealStage') }}</h5>
              <div class="mt-4 flex justify-content-between gap-4">
                <div class="flex flex-column w-full gap-2">
                  <label for="funnel">{{ $t('choosePipeline') }}:</label>
                  <Dropdown style="margin-top: 8px" id="funnel" v-model="funnelId" :options="funnels" optionLabel="title" :placeholder="t('chooseField')"></Dropdown>
                </div>
                <div class="flex flex-column w-full gap-2">
                  <label for="statusId">{{ $t('changeStatus') }}:</label>
                  <Dropdown style="margin-top: 8px" id="statusId" v-model="statusId" :options="statuses" optionLabel="title" :placeholder="t('chooseField')"></Dropdown>
                </div>
              </div>
              <div class="flex flex-column mt-3">
                <label for="writeDealNote" style="font-weight: 700; margin-bottom: 12px;">{{ $t('writeDealNote') }}</label>
                <Textarea :placeholder="t('dealNoteText')" :autoResize="true" rows="3" cols="2" />
              </div>
              <div class="flex flex-column mt-3">
                <label for="setFieldValue" style="font-weight: 700; margin-bottom: 12px;">{{ $t('setFieldValue') }}</label>
                <div class="flex align-items-center gap-4">
                  <div class="flex flex-column gap-2 w-full">
                    <label for="chooseField">{{ $t('chooseField') }}</label>
                    <InputText id="chooseField" type="text" />
                  </div>
                  <div class="flex flex-column gap-2 w-full">
                    <label for="enterFieldValue">{{ $t('enterFieldValue') }}</label>
                    <InputText id="enterFieldValue" type="text" />
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Статус в Kommo">
              <div class="mt-4 flex justify-content-between gap-4">
                <div class="flex flex-column w-full gap-2">
                  <label for="funnel">Выберите воронку:</label>
                  <Dropdown style="margin-top: 8px" id="funnel" v-model="funnelId" :options="funnels" optionLabel="title" placeholder="Выберите один"></Dropdown>
                </div>
                <div class="flex flex-column w-full gap-2">
                  <label for="statusId">Изменить статус на:</label>
                  <Dropdown style="margin-top: 8px" id="statusId" v-model="statusId" :options="statuses" optionLabel="title" placeholder="Выберите один"></Dropdown>
                </div>
              </div>
            </TabPanel>
          </TabView>
          <div class="mt-4 flex gap-4 justify-content-end align-items-center">
            <nuxt-link to="/chatbots" style="color: #334155">{{ $t('goBack')}}</nuxt-link>
            <Button :label="t('save')"></Button>
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
</style>