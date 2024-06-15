<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const { t } = useI18n();
const channels = ref([
  {
    id: 1,
    title: 'amoCRM',
    key: 'amocrm'
  },
  {
    id: 2,
    title: 'Bitrix24',
    key: 'bitrix24'
  },
  {
    id: 3,
    title: 'Telegram',
    key: 'telegram'
  },
  {
    id: 4,
    title: 'Whatsapp',
    key: 'whatsapp'
  },
  {
    id: 5,
    title: 'Avito',
    key: 'avito'
  },
  {
    id: 6,
    title: t('onlineChat'),
    key: 'onlineChat'
  }
]);

const channelStore = useChannelStore();

const createChannel = (key: string) => {
  return navigateTo({ name: `channels-create-${key}`})
}

const availableChannels = computed(() => {
  return channelStore.getChannels?.filter((channel) => !channel.connected)
})


const deleteChannel = async (id: string) => {
  await channelStore.deleteChannel(id).then(async (res) => {
    if (res.success) {
      await channelStore.getAllChannels();
    } else {
      toast.add({ severity: 'error', summary: t('error'), detail: res?.message, life: 5000 })
    }
  });
}

const openChannel = (type: string, id: string) => {
  if (type === 'wappi') {
    return navigateTo({ name: `channels-whatsapp-id`, params: { id }})
  }
  return navigateTo({ name: `channels-${type}-id`, params: { id }})
}

onMounted(async () => {
  await channelStore.getAllChannels();
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="font-bold">{{ $t('connectNewChannel') }}</h5>
        <div class="mt-5 bot-list">
          <button
              v-for="(bot) in channels"
              :key="bot.id"
              class="bot-item"
              @click="createChannel(bot.key)"
          >{{ bot.title }}</button>
        </div>
        <div class="chanel-list" v-if="availableChannels.length">
          <h5 class="font-bold mb-2">{{ $t('availableChannels') }}</h5>
          <span class="chanel-list__item" v-for="channel in availableChannels" :key="channel._id">
                  {{ channel.title }}
                  <span class="font-bold ml-2">({{ channel.type }})</span>
                  <i style="cursor: pointer; margin-left: auto; margin-right: 10px; color: #EE9186;" class="pi pi-trash" @click="deleteChannel(channel._id)"/>
                  <i style="cursor: pointer" class="pi pi-cog" @click="openChannel(channel.type, channel._id)"/>
                </span>
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
.bot-item {
  background: #F0F4F9;
  border: 1px solid var(--surface-border);
  padding: 16px;
  box-shadow: var(--card-shadow);
  border-radius: $borderRadius;
  cursor: pointer;
}
</style>