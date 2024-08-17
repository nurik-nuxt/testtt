<script setup lang="ts">
import { useTelegramBotToken } from "~/src/shared/store/dashboard/telegramBotToken";

console.log('Telegram Notification')
const telegramTokenStore = useTelegramBotToken();
const userName = ref<string>('');
const botToken = ref<string>('');

onMounted(async () => {
  await telegramTokenStore.loadTelegraBotToken().then((res) => {
    userName.value = res?.username;
    botToken.value = res?.token
  })
})

const save = async () => {
  await telegramTokenStore.addTelegramBotToken({ username: userName.value, token: botToken.value })
  console.log('save')
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="font-bold text-lg mb-5">Telegram Notification</div>
        <div class="flex flex-column gap-5">
          <div class="flex flex-column gap-2">
            <div class="font-bold text-lg">Бот никнейм</div>
            <InputText v-model="userName" />
          </div>
          <div class="flex flex-column gap-2">
            <div class="font-bold text-lg">Бот токен</div>
            <InputText v-model="botToken" />
          </div>
          <div class="flex align-items-center justify-content-end">
            <Button label="Сохранить" @click="save" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>