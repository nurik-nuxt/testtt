<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import {useToast} from "primevue/usetoast";

const channelStore = useChannelStore();
const { t } = useI18n();
const toast = useToast();

const channelTitle = ref<string>('')

const createChannel = async () => {
  await channelStore.createNewChannel({ type: 'whatsapp', title: channelTitle.value }).then((res) => {
    if (res.success) {
      toast.add({ severity: 'success', summary: t('ready'), life: 5000 });
      return navigateTo({ name: 'channels-whatsapp-id', params: { id: res.channel._id } })
    }
  })
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="mt-4 mb-4">WhatsApp</h5>
        <div class="flex flex-column gap-2 mb-4">
          <label for="channelTitle" style="font-weight: 700">{{ $t('channelNameOnly') }} <span style="color: red">*</span></label>
          <InputText id="channelTitle" type="text" v-model="channelTitle" class="channel-title" />
        </div>
        <Button :label="t('toPlug')" @click="createChannel" :disabled="!channelTitle.length" class="save-btn"></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.save-btn {
  width: 50%
}

.channel-title {
  width: 50%
}

@media (max-width: 601px) {
  .save-btn {
    width: 100% !important;
  }
  .channel-title {
    width: 100% !important;
  }
}
</style>