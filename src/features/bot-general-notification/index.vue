<script setup lang="ts">
import { useNotificationStore } from "~/src/shared/store/notification";

const { t } = useI18n();
const notificationStore = useNotificationStore();

const telegramLink = ref<string>('')

const openTelegram = () => {
  window.open(telegramLink.value, '_blank');
}

onMounted(async () => {
  await notificationStore.getTelegramNotificationLink().then((res) => {
    const response = JSON.parse(res);
    telegramLink.value = response?.link;
  })
})
</script>

<template>
  <div class="notification-wrapper">
    <div class="notification-card">
      <div class="flex flex-column gap-2">
        <h5>{{ $t('telegram') }}</h5>
        <span style="color: #0f172a;">{{ $t('subscribeBotLink') }}</span>
        <Button severity="secondary" raised :label="t('subscribe')" class="mt-3 connect-btn" @click="openTelegram"/>
      </div>
    </div>
    <div class="notification-card">
      <div class="flex flex-column gap-2">
        <h5>{{ $t('email') }}</h5>
        <span style="color: #0f172a;">{{ $t('enterEmailForNotifications') }}</span>
        <InputText class="mt-3" style="max-width: 500px" :placeholder="t('email')" id="email" type="text" />
      </div>
    </div>
<!--    <div class="notification-card">-->
<!--      <div class="flex align-items-end webhooks">-->
<!--        <div class="flex flex-column gap-2 w-3/4">-->
<!--          <h5>{{ $t('webhooks') }}</h5>-->
<!--          <span style="color: #0f172a;">{{ $t('webhookUrl') }}</span>-->
<!--          <InputText class="mt-3" style="max-width: 500px" placeholder="Url" id="site" type="text" />-->
<!--        </div>-->
<!--        <div class="json-snippet">-->
<!--          <span class="font-bold">json</span>-->
<!--          <span class="ml-2 font-bold">fghj</span>-->
<!--          <span class="ml-4 font-bold">"ghjkl;'"</span>-->
<!--          <span class="ml-2 font-bold">"hjbnmpokl"</span>-->
<!--          <span class="font-bold">end</span>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<style scoped>
.json-snippet {
  background-color: #D6F0FF;
  border-radius: 4px;
  padding: 8px;
  height: 100px;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>