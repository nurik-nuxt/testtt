<script setup lang="ts">
import { useBotStore } from "~/src/shared/store/bot";
import { useUploadFileStore } from "~/src/shared/store/upload";
import { useKnowledgeStore } from "~/src/shared/store/knowledge";
import { useAmoCrmStore } from "~/src/shared/store/amocrm";

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

const usedValue = ref<boolean>(true);
const interruptDialogue = ref<boolean>(false);
const telegramNotification = ref<boolean>(false);

const funnelId = ref<string>('');

const statusId = ref<string>('')


const timeList = ref([
  {
    id: 'seconds',
    title: t('perSeconds')
  },
  {
    id: 'minutes',
    title: t('perMinutes')
  },
  {
    id: 'hours',
    title: t('perHour')
  },
  {
    id: 'days',
    title: t('perDay')
  }
]);


const messages = ref<{ id: number, quantity: number, message: string, timeframe: string }[]>([]);

const addMessage = () => {
  messages.value.push({ id: messages.value.length + 1, quantity: 10, message: '', timeframe: 'seconds'})
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

const botStore = useBotStore();
const uploadFileStore = useUploadFileStore();
const knowledgeStore = useKnowledgeStore();
const amoCrmStore = useAmoCrmStore();

const bot = computed(() => {
  return botStore.currentBot
})

const files = computed(() => {
  return uploadFileStore.getFiles
})

const fileRef = ref();
const openFileUploader = () => {
  const fileInput = document.getElementById('file-upload');
  if (fileInput) {
    fileInput.click();
  }
}

const addFile = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;
  if (!file) return;
  await uploadFileStore.loadFile(file);
}

const deleteFile = (index: number) => {
  uploadFileStore.deleteFileByIndex(index)
}

onMounted(async () => {
  await amoCrmStore.fetchVoronki();
  await amoCrmStore.fetchAmoCrmFields();
})

const funnels = computed(() => {
  return amoCrmStore.getAllFunnels
})

const fields = computed(() => {
  return amoCrmStore.getFields
})

const fieldId = ref<string>('')

const fieldValue = ref<string>('')

const statuses = computed(() => {
  if (amoCrmStore.getAllFunnels.length) {
    return amoCrmStore.getAllFunnels?.find((funnel) => funnel.id === funnelId.value)?._embedded?.statuses
  } else {
    return  []
  }
})

const name = ref('')
const rus_name = ref('')
const content = ref('')

const actions = ref<any>([])
const writeDealNote = ref('')

const saveKnowledge = async () => {
  if (name.value.length && content.value.length) {
    await knowledgeStore.addBaseKnowledge(<string>route.params.id, {
      name: name.value,
      rus_name: rus_name.value,
      content: content.value
    }).then(async (res) => {
      if (res.success) {
        if (messages?.value?.length) {
          const delay = {
            parameters: {
              times: messages.value
            },
            name: 'delay'
          }
          actions.value.push(delay)
        }
        if (files.value.length) {
          files?.value?.forEach(file => {
            actions.value.push({
              parameters: {
                fileName: file.filename,
                type: file.mimeType.includes('image') ? 'picture' : 'document'
              },
              name: "send_file"
            });
          });
        }
        if (funnelId.value && statusId.value) {
          actions.value.push({ parameters: { status_id: statusId.value, pipeline: funnelId.value }, name: 'move_in_pipeline'})
        }
        if (writeDealNote.value) {
          actions.value.push({ parameters: { text: writeDealNote.value }, name: 'add_note' })
        }
        if (fieldId.value) {
          const editLeadCard = {
            parameters: {
              custom_fields_values: [
                {
                  field_id: fieldId.value,
                  values: [
                    {
                      value: fieldValue.value
                    }
                  ]
                }
              ]
            },
          }
          actions.value.push(editLeadCard)
        }
        await knowledgeStore.addKnowledgeActions(<string>route.params.id, res.insertedId, actions.value).then(() => {
          uploadFileStore.$reset();
          return navigateTo({ name: 'chatbots-id', params: { id: route.params.id }})
        })
      }
    })
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <h5>{{ $t('editKnowledgeBaseFile') }} "{{ bot?.name }}"</h5>
        <div class="card-form p-fluid" style="margin-top: 16px">
          <div class="flex gap-3">
            <div class="field w-full">
              <label for="name1">{{ $t('nameWithin7s') }}</label>
              <InputText id="rus_name" type="text" v-model="name" />
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
              <Textarea class="mt-4 w-full" :autoResize="true" rows="5" cols="30" :placeholder="t('botResponseInstructions')" v-model="content" />
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
                      <InputText id="quantity" type="number" min="1" style="max-width: 70px" v-model="message.quantity"/>
                      <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="timeItem" v-model="message.timeframe" :options="timeList" optionLabel="title" option-value="id"></Dropdown>
                    </div>
                    <Dropdown class="ml-4 mt-2 mb-2" id="messageType" v-model="messageType" :options="messageTypes" optionLabel="title" option-value="id" :placeholder="t('chooseOption')"></Dropdown>
                    <InputText v-if="messageType ==='sendMyMessage'" class="ml-4 mt-4" id="purchaseDecision" type="text" :placeholder="t('purchaseDecision')" />
                    <Textarea v-if="messageType ==='generateUsingAI'" class="ml-4 mt-4" id="analyzeLast5Messages" type="text" :placeholder="t('analyzeLast5Messages')" :autoResize="true" rows="1" cols="2" v-model="message.message" />
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
                  <Button :label="t('attachFile')" icon="pi pi-plus" @click="openFileUploader"></Button>
                  <input id="file-upload" hidden type="file" @input="addFile">
                  <Button :label="t('downloadFile')" icon="pi pi-upload"></Button>
                  <Button :label="t('deleteFile')" icon="pi pi-times"></Button>
                  <span>{{ $t('maxFileSize5MB') }}</span>
                </div>
                <div v-if="files.length" class="flex flex-column gap-3">
                  <div class="flex flex-column gap-3" v-for="(file, index) in files" :key="index">
                    <div class="flex gap-3 align-items-center" v-if="file.mimeType.includes('image')">
                      <img :src="`https://api.7sales.ai/public/${file.filenameEncodeFull}`" :alt="file.originalName" class="image">
                      <span class="text-base font-bold">{{ file.originalName }}</span>
                      <i class="pi pi-trash ml-auto " style="cursor: pointer; color: #EE9186; font-size: 24px" @click="deleteFile(parseInt(<string>index))"></i>
                    </div>
                    <div class="flex gap-3 align-items-center" v-else>
                      <i class="pi pi-file" style="font-size: 60px" @click="deleteFile(parseInt(<string>index))"></i>
                      <span class="text-base font-bold">{{ file.originalName }}</span>
                      <i class="pi pi-trash ml-auto " style="cursor: pointer; color: #EE9186; font-size: 24px" @click="deleteFile(parseInt(<string>index))"></i>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel :header="t('crmSystemManagement')">
              <h5 class="mt-4">{{ $t('changeDealStage') }}</h5>
              <div class="mt-4 flex justify-content-between gap-4">
                <div class="flex flex-column w-full gap-2">
                  <label for="funnel">{{ $t('choosePipeline') }}:</label>
                  <Dropdown style="margin-top: 8px" id="funnel" v-model="funnelId" :options="funnels" optionLabel="name" option-value="id" :placeholder="t('chooseField')"></Dropdown>
                </div>
                <div class="flex flex-column w-full gap-2">
                  <label for="statusId">{{ $t('changeStatus') }}:</label>
                  <Dropdown style="margin-top: 8px" id="statusId" v-model="statusId" :options="statuses" optionLabel="name" option-value="id" :placeholder="t('chooseField')"></Dropdown>
                </div>
              </div>
              <div class="flex flex-column mt-3">
                <label for="writeDealNote" style="font-weight: 700; margin-bottom: 12px;">{{ $t('writeDealNote') }}</label>
                <Textarea :placeholder="t('dealNoteText')" :autoResize="true" rows="3" cols="2" v-model="writeDealNote" />
              </div>
              <div class="flex flex-column mt-3">
                <label for="setFieldValue" style="font-weight: 700; margin-bottom: 12px;">{{ $t('setFieldValue') }}</label>
                <div class="flex align-items-center gap-4">
                  <div class="flex flex-column gap-2 w-full">
                    <label for="chooseField">{{ $t('chooseField') }}</label>
                    <Dropdown style="margin-top: 8px" id="funnel" v-model="fieldId" :options="fields" optionLabel="name" option-value="id" placeholder="Выберите один"></Dropdown>
                  </div>
                  <div class="flex flex-column gap-2 w-full">
                    <label for="enterFieldValue">{{ $t('enterFieldValue') }}</label>
                    <InputText id="enterFieldValue" type="text" v-model="fieldValue" />
                  </div>
                </div>
              </div>
            </TabPanel>
<!--            <TabPanel header="Статус в Kommo">-->
<!--              <div class="mt-4 flex justify-content-between gap-4">-->
<!--                <div class="flex flex-column w-full gap-2">-->
<!--                  <label for="funnel">Выберите воронку:</label>-->
<!--                  <Dropdown style="margin-top: 8px" id="funnel" v-model="funnelId" :options="funnels" optionLabel="title" placeholder="Выберите один"></Dropdown>-->
<!--                </div>-->
<!--                <div class="flex flex-column w-full gap-2">-->
<!--                  <label for="statusId">Изменить статус на:</label>-->
<!--                  <Dropdown style="margin-top: 8px" id="statusId" v-model="statusId" :options="statuses" optionLabel="title" placeholder="Выберите один"></Dropdown>-->
<!--                </div>-->
<!--              </div>-->
<!--            </TabPanel>-->
          </TabView>
          <div class="mt-4 flex gap-4 justify-content-end align-items-center">
            <nuxt-link :to="`/chatbots/${route.params.id}`" style="color: #334155">{{ $t('goBack')}}</nuxt-link>
            <Button :label="t('save')" @click="saveKnowledge"></Button>
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
.image {
  width: 150px;
  height: 100px;
  object-fit: contain;
}
</style>