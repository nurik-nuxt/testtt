<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const { t } = useI18n();
const channelStore = useChannelStore()
const type = ref<string>('amocrm')
const createAmoCrmChannel = async () => {
  await channelStore.createNewChannel({ type: type.value }).then((res) => {
    if (!res.success) {
      toast.add({ severity: 'error', summary: t('error'), detail: res?.message, life: 5000 })
    } else {
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
        <Button :label="t('connectAmoCRM')" @click="createAmoCrmChannel"></Button>
      </div>
    </div>
  </div>
</template>