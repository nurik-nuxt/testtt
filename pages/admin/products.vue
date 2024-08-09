<script setup lang="ts">
import { useDefaultPromtsStore } from "~/src/shared/store/dashboard/promts";
import {useToast} from "primevue/usetoast";

const toast = useToast();

const defaultPromtsStore = useDefaultPromtsStore();

const systemInstruction = ref<string>('');
const knowledgeBasePrompt = ref<string>('');
const defaultPrompt = ref<string>('');
const apiSecretKey = ref<string>('');


onMounted(async () => {
  await defaultPromtsStore.loadDefaultPromts().then((res) => {
    systemInstruction.value = res?.systemInstruction
    knowledgeBasePrompt.value = res?.knowledgeBasePrompt
    defaultPrompt.value = res?.defaultPrompt
    apiSecretKey.value = res?.apiSecretKey
  });
})

const saveDefaultPromts = async () => {
  const defaultPromts = {
    systemInstruction: systemInstruction.value,
    knowledgeBasePrompt: knowledgeBasePrompt.value,
    defaultPrompt: defaultPrompt.value,
    apiSecretKey: defaultPrompt.value
  }
  await defaultPromtsStore.updateDefaultPromts(defaultPromts).then((res) => {
    if (res?.success) {
      toast.add({ severity: 'success', summary: 'Успешно', detail:'Записи успешно обновлены', life: 5000 })
    } else {
      toast.add({ severity: 'error', summary: 'Ошибка', detail:'Не найдено записей для обновления', life: 5000 })
    }
  })
}
</script>

<template>
  <Toast />
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex flex-column gap-3">
          <div class="flex align-items-center justify-content-end">
<!--            <h5 class="mb-0">ПРОВЕРЬ 100 РАЗ И ТОЛЬКО ПОТОМ ОБНОВИ!</h5>-->
            <Button label="Сохранить" @click="saveDefaultPromts" />
          </div>
          <div class="flex flex-column gap-2">
            <div class="font-bold text-lg">Системная инструкция (ПРОМТ)</div>
            <div>промт который добавляется к промту Пользователя, определяет основные параметры взаимодействия с системой.</div>
            <Textarea v-model="systemInstruction" :autoResize="true" rows="5" cols="2" />
          </div>
          <div class="flex flex-column gap-2">
            <div class="font-bold text-lg">Формирование Базы Знаний из текста</div>
            <div>Промт, который автоматически разбивает текст на логические блоки вопрос-ответ и формирует файлы Базы знаний</div>
            <Textarea :autoResize="true" rows="5" cols="2" v-model="knowledgeBasePrompt" />
          </div>
          <div class="flex flex-column gap-2">
            <div class="font-bold text-lg">Default Promt</div>
<!--            <div>Промт, который автоматически разбивает текст на логические блоки вопрос-ответ и формирует файлы Базы знаний</div>-->
            <Textarea :autoResize="true" rows="5" cols="2" v-model="defaultPrompt" />
          </div>
          <div class="flex flex-column gap-2">
            <div class="font-bold text-lg">API Secret key</div>
            <div>API Secret key OpenAI для общего использования</div>
            <InputText v-model="apiSecretKey" />
          </div>
          <div class="flex align-items-center justify-content-end">
            <!--            <h5 class="mb-0">ПРОВЕРЬ 100 РАЗ И ТОЛЬКО ПОТОМ ОБНОВИ!</h5>-->
            <Button label="Сохранить" @click="saveDefaultPromts" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>