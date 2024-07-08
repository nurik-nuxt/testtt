<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useToast } from "primevue/usetoast";

const { t } = useI18n();

const channelStore = useChannelStore();
const toast = useToast();
const channelTitle = ref<string>('');
const clientId = ref<string>('');
const clientSecret = ref<string>('');

const createChannel = async () => {
  await channelStore.createNewChannel({
    title: channelTitle.value,
    credentials: {
      client_id: clientId.value,
      client_secret: clientSecret.value
    },
    type: 'avito'
  }).then((res) => {
    if (res.success) {
      toast.add({ severity: 'success', summary: t('ready'), life: 5000 });
      return navigateTo({ name: 'channels-avito-id', params: { id: res?.channel?._id }})
    }
    else {
      toast.add({ severity: 'error', summary: res?.message, life: 5000 });
    }
    console.log(res)
  })
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="mt-4">{{ $t('avitoConnection') }}</h5>
        <div class="flex flex-column gap-2">
          <span>1.{{ $t('connectAnyTariff') }}</span>
          <span class="mb-3">2.{{ $t('copyDataPage') }} <a target="_blank" href="https://www.avito.ru/professionals/api" style="color: #076AE1;">({{ $t('link') }})</a></span>
          <div class="flex flex-column gap-2 mb-2">
            <label for="channelTitle" style="font-weight: 700">{{ $t('channelNameOnly') }} <span style="color: red">*</span></label>
            <InputText id="channelTitle" type="text" v-model="channelTitle" class="channel-title" />
          </div>
          <div class="flex flex-column gap-3 mb-2">
            <label for="name1" style="font-weight: 700">{{ $t('enterData') }}</label>
            <InputText id="clientId" type="text" placeholder="Client_ID" v-model="clientId" class="channel-title" />
            <InputText id="clientSecret" type="text" placeholder="Client_Secret" v-model="clientSecret" class="channel-title" />
          </div>
          <Button :label="t('toPlug')" @click="createChannel" :disabled="!clientId.length || !clientSecret.length || !channelTitle.length" class="save-btn"></Button>
        </div>
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