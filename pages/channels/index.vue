<script setup lang="ts">
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

const createChannel = (key: string) => {
  return navigateTo({ name: `channels-create-${key}`})
}
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