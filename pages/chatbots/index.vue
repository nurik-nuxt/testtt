<script setup lang="ts">
import { BotCard } from "~/src/shared/components/bot-card";

interface BotItem {
  title: string;
  id: number;
  channels: string[];
  isActive: boolean
}

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

const createBot = () => {
  return navigateTo({ name: 'chatbots-create' })
}
const { t } = useI18n();

</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <h5>{{ $t('bots') }}</h5>
        <Button :label="t('newBot')" @click="createBot"/>
        <div class="mt-5 bot-list">
          <bot-card
              v-for="(bot, i) in bots"
              :key="i"
              :title="bot.title"
              :id="bot.id"
              :channels="bot.channels"
              :is-active="bot.isActive"
          />
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