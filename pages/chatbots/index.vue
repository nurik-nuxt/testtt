<script setup lang="ts">
import { useBotStore } from "~/src/shared/store/bot";
import { BotCard } from "~/src/shared/components/bot-card";

interface BotItem {
  title: string;
  id: number;
  channels: string[];
  isActive: boolean
}

const botStore = useBotStore();

const createBot = async () => {
  await botStore.createBot().then(async (res) => {
    return navigateTo({ name: 'chatbots-id', params: { id: res.id }})
  });
}
const { t } = useI18n();

onMounted(() => {
  botStore.getBotList()
});

const bots = computed(() => {
  return botStore.getBots
})
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
              :name="bot.name"
              :id="i"
              :bot-id="bot._id"
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