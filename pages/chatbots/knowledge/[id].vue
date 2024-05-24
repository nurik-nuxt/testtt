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
              <Button label="Новое сообщение" class="mt-4"/>
            </TabPanel>
            <TabPanel :header="t('sendFileInMessage')">
              <Button label="Прикрепить изображение" class="mt-4"/>
            </TabPanel>
            <TabPanel :header="t('crmSystemManagement')">
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