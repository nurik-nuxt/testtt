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
const apiKey = ref(null);
const model = ref(null);

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
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <h5>Редактирование "{{ bots.find((bot) => bot.id === Number(route.params.id)).title }}"</h5>
        <div>
          <TabView>
            <TabPanel header="Общие">
              <div class="card-form p-fluid" style="margin-top: 16px">
                <div class="field">
                  <label for="name1" style="font-weight: 700">Название бота</label>
                  <InputText id="name1" type="text" />
                </div>
                <div class="field">
                  <label style="font-weight: 700">Инструкции</label>
                  <Textarea placeholder="Инструкция Бота " :autoResize="true" rows="3" cols="30" />
                </div>
              </div>
              <span class="bot-card__activate">
                Приветствовать собеседника при начале разговора
                <InputSwitch v-model="switchValue" style="margin-left: 8px"/>
              </span>
              <div v-if="switchValue" class="card-form p-fluid">
                <div class="field" style="margin-top: 12px">
                  <Textarea placeholder="Введите первое сообзение" :autoResize="true" rows="3" cols="30" />
                </div>
              </div>
              <span class="bot-card__activate" style="margin-top: 8px">
                Дополнительно
                <InputSwitch v-model="extra" style="margin-left: 8px"/>
              </span>
              <div v-if="extra" class="card-form p-fluid" style="margin-top: 12px">
                <label for="name1" style="font-weight: 700">API Secret Key</label>
                <Dropdown style="margin-top: 8px" id="apiKey" v-model="apiKey" :options="apiKeyTypes" optionLabel="title" placeholder="Выберите один"></Dropdown>
                <InputText style="margin-top: 8px; margin-bottom: 16px;" id="name1" type="password" />
                <label for="name1" style="font-weight: 700">Модель</label>
                <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="apiKey" v-model="model" :options="models" optionLabel="title" placeholder="Выберите один"></Dropdown>
                <span style="color: #64748b">От выбора модели зависит стоимость токенов и качество ответов. <br> GPT-3.5 – самая быстрая и дешевая текстовая модель, GPT-4 – дороже.</span>
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">Таймаут объединение сообщений (секунд)</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" />
                  <span style="color: #64748b">Время ожидания, в течение которого все входящие сообщения в чате будут обрабатываться как один запрос. <br> Рекомендуем установить 10-15 сек.</span>
                </div>
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">Общий таймаут ожидания ответа (часов)</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" />
                  <span style="color: #64748b">Время ожидания, в течение которого все входящие сообщения в чате будут обрабатываться как один запрос. <br> Рекомендуем установить 10-15 сек.</span>
                </div>
                <div class="field" style="margin-top: 12px">
                  <label for="name1" style="font-weight: 700">Приостанавливать на (минут)</label>
                  <InputText style="margin-bottom: 8px" id="name1" type="number" />
                  <span style="color: #64748b">Время на которое бот приостановится в чате, если в чат напишет оператор. <br> Не работает если оператор пишет из amoCRM и Битрикс24.</span>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="База Знаний">
              <div class="flex gap-2 mt-5">
                <Button label="Создать" @click="createKnowledgeBase(parseInt(<string>route.params.id))"/>
                <Button label="Загрузить"/>
                <Button label="Удалить"/>
              </div>
              <div>
                <TreeTable v-model:selectionKeys="knowledgeBaseSelectedKey" :value="knowledgeBaseList" selectionMode="checkbox" class="w-full">
                  <Column field="label" header="Название" :expander="true"></Column>
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
            <TabPanel header="Каналы">
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
            <TabPanel header="Уведомления">
              <div class="notification-wrapper">
                <div class="notification-card">
                  <div class="flex flex-column gap-2">
                    <h5>Telegram</h5>
                    <span style="color: #0f172a;">Подписавшись на бота по ссылке чтобы получать уведомления в Telegram о событиях из Базы Знаний, в которых включена функция "Уведомление" <a target="_blank" href="https://web.telegram.org/" style="color: #076AE1;">(Ссылка)</a></span>
                  </div>
                </div>
                <div class="notification-card">
                  <div class="flex flex-column gap-2">
                    <h5>E-mail</h5>
                    <span style="color: #0f172a;">Напишите адрес почты, на которую будут приходить уведомления от 7s</span>
                    <InputText class="mt-3" style="max-width: 500px" placeholder="Email" id="email" type="text" />
                  </div>
                </div>
                <div class="notification-card">
                  <div class="flex flex-column gap-2">
                    <h5>Webhook</h5>
                    <span style="color: #0f172a;">Вы можете оповещать сторонние приложения о событиях, произошедших в 7s, с помощью уведомлений. Для этого укажите URL, на который Вам будет отправлен WebHook.</span>
                    <InputText class="mt-3" style="max-width: 500px" placeholder="Url" id="site" type="text" />
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
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