<script setup lang="ts">
import {useChannelStore} from "~/src/shared/store/channel";
import {useToast} from "primevue/usetoast";
import {useClipboard} from "@vueuse/core";
import { useAuthStore } from "~/src/shared/store/auth";

onMounted(() => {
  console.log('Create Bitrix24')
})

const { t } = useI18n();
const toast = useToast();

const type = ref<string>('bitrix24')
const webhook = ref<string>('')
const channelTitle = ref<string>('');

const channelStore = useChannelStore()

const goBack = () => {
  return navigateTo(`/channels`)

}

const createBitrix24Channel = async () => {
  console.log('createBitrix24Channel')
  await channelStore.createNewChannel({ type: type.value, title: channelTitle.value, webhook: webhook.value}).then((res) => {
    if (!res?.success) {
      toast.add({ severity: 'error', summary: t('error'), detail: res?.message, life: 5000 })
    } else {
      toast.add({ severity: 'success', summary: t('ready'), life: 5000 });
      return navigateTo({ name: 'channels-bitrix24-id', params: { id: res?.channel?._id }})
    }
  })
}

const isSaveDisabled = computed(() => !webhook.value || !channelTitle.value);
const { copy } = useClipboard();
const authStore = useAuthStore();

const copyWebhook = async () => {
  await copy(`https://api.7sales.ai/bitrix24/webhook/${authStore?.userData?._id}`).then(() => {
    toast.add({ severity: 'success', summary: t('successClipboard'), life: 5000 });

  });

}
</script>

<template>
  <Toast />

  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-3">
          <h5 class="font-bold mb-0">Bitrix24</h5>
          <div class="flex gap-4 justify-content-end align-items-center">
            <Button :label="t('goBack')" @click="goBack" severity="secondary" text></Button>
            <Button :label="t('save')" @click="createBitrix24Channel" :disabled="isSaveDisabled"></Button>
          </div>
        </div>
        <div class="flex flex-column">
          <div class="flex flex-column gap-1 mb-4">
            <p class="mb-0">1. Зайдите в Битрикс24.</p>
            <p class="mb-0">2. Перейдите в меню Приложения/Разработчикам --> Добавить чат-бот --> Передавать боту сообщение из чата.</p>
            <p class="mb-0">3. Скопируйте вебхук из поля "Вебхук для вызова rest api" и вставьте его в поле URL.</p>
          </div>
          <div class="flex flex-column gap-1 mb-4">
            <label for="channelTitle" style="font-weight: 700">WEBHOOK<span style="color: red">*</span></label>
            <InputText id="channelTitle" type="text" v-model="webhook" />
          </div>
          <div class="flex flex-column gap-1 mb-4">
            <p>4. Задайте название бота (оно будет выводиться в чате).</p>
            <div class="flex flex-column gap-2 mb-4">
              <label for="channelTitle" style="font-weight: 700">Название бота<span style="color: red">*</span></label>
              <InputText id="channelTitle" type="text" v-model="channelTitle" />
            </div>
            <p>5. Нажмите на кнопку "Скопировать WEBHOOK" и вставьте его в поле "URL обработчика бота".</p>
          </div>
          <Button :label="t('copyWebhook')" class="webhook-btn" @click="copyWebhook"></Button>
          <div class="flex flex-column gap-1 mt-4 mb-4">
            <p>6. Выберите тип бота: "Чат-бот для Открытых линий".</p>
            <p>7. Снимите галку "Исходящий вебхук"</p>
            <p>8. В разделе "Настройка прав" выберите права "CRM", "Создание и управление Чат-ботами", "Открытые линии", "Чат и уведомления", "Служба сообщений", "Диск".</p>
            <p>9. Далее чат бот будет доступен в меню Приложения/Разработчикам --> Интеграции</p>
            <p>10. Перейдите в меню CRM --> Интеграции (на верхней панели) --> Месенджеры.</p>
            <p>11. Выберите онлайн-чат (или тот, который используете) и в нем выберите "Открытая линия".</p>
            <p>12. В разделе "Настройка канала" нажмите "НАСТРОИТЬ"</p>
            <p>13. В открывшемся меню выберите раздел "Чат-боты".</p>
            <p>14. Поставьте галку "При обращении клиента назначить ответственным чат-бота".</p>
            <p>15. Выбирите созданного чат-бота и настройки его поведения. Нажмите "СОХРАНИТЬ"</p>
            <p>16. Нажмите кнопку "Подключить" ниже.</p>
          </div>
        </div>
        <div class="mt-4 flex gap-4 justify-content-end align-items-center">
          <Button :label="t('goBack')" @click="goBack" severity="secondary" text></Button>
          <Button :label="t('save')" @click="createBitrix24Channel" :disabled="isSaveDisabled"></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.webhook-btn {
  width: 30%;
  @media (max-width: 601px) {
    width: 100% !important;
  }
}
</style>

