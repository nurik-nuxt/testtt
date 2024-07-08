<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const { t } = useI18n();
const channelStore = useChannelStore()
const type = ref<string>('amocrm')
const channelTitle = ref<string>('')
const createAmoCrmChannel = async () => {
  await channelStore.createNewChannel({ type: type.value, title: channelTitle.value }).then((res) => {
    if (!res.success) {
      toast.add({ severity: 'error', summary: t('error'), detail: res?.message, life: 5000 })
    } else {
      toast.add({ severity: 'success', summary: t('ready'), life: 5000 });
      if (res.needActions) {
        window.open(res?.actions.data, '_blank');
      }
      return navigateTo({ name: `channels-amocrm-id`, params: { id: res.channel._id }})
    }
  })
}
</script>

<template>
  <Toast />
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="font-bold">AmoCRM</h5>
        <div class="flex flex-column gap-2 mb-4">
          <label for="channelTitle" style="font-weight: 700">{{ $t('channelNameOnly') }} <span style="color: red">*</span></label>
          <InputText id="channelTitle" type="text" v-model="channelTitle" />
        </div>
        <Button :label="t('connectAmoCRM')" @click="createAmoCrmChannel" :disabled="!channelTitle.length"></Button>
      </div>
    </div>
  </div>
</template>