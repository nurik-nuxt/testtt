<script setup lang="ts">

const bots = ref([
  {
    id: 1,
    title: 'Чат-бот Telegram',
    key: 'telegram'
  },
  {
    id: 2,
    title: 'Чат-бот Instagram',
    key: 'instagram'
  },
  {
    id: 3,
    title: 'Чат-бот WhatsApp',
    key: 'whatsapp'
  },
  {
    id: 4,
    title: 'Чат для сайта',
    key: 'chat'
  }
]);

const createKnowledge = (key: string) => {
  return navigateTo(`/admin/knowledge/create?chatbot=${key}`)
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <h5>База знаний</h5>
        <div class="mt-5 bot-list">
          <button
              v-for="(bot) in bots"
              :key="bot.id"
              class="bot-item"
              @click="createKnowledge(bot.key)"
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