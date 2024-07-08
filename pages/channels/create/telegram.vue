<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useToast } from "primevue/usetoast";

const channelStatus = ref('');
const step = ref<number | null>(1)
const { t } = useI18n();
const toast = useToast();


const channelStore = useChannelStore();

const type = ref<string>('telegram');
const token = ref<string>('')
const channelTitle = ref<string>('')

const createChannel = async () => {
  await channelStore.createNewChannel({
    type: type.value,
    token: token.value,
    title: channelTitle.value,
  }).then((res) => {
    if (res.success) {
      toast.add({ severity: 'success', summary: t('ready'), life: 5000 });
      return navigateTo({ name: 'channels-telegram-id', params: { id: res?.channel?._id }})
    }
    if (res?.reason === 'not_unique') {
      toast.add({ severity: 'error', summary: t('telegramAlreadyRegistered'), life: 5000 });
    }
  })
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div>
          <h5 class="mt-4">{{ $t('connectingTelegramBot') }}</h5>
          <div v-if="step === 1">
            <div class="flex flex-column gap-2">
              <span>1.{{ $t('openTelegramApp') }}</span>
              <span class="mb-3">2.{{ $t('copyBotToken') }}</span>
              <div class="flex flex-column gap-2 mb-2">
                <label for="channelTitle" style="font-weight: 700">{{ $t('channelNameOnly') }} <span style="color: red">*</span></label>
                <InputText id="channelTitle" type="text" v-model="channelTitle" class="channel-title" />
              </div>
              <InputText id="token" type="text" placeholder="tokken:telegrambota" v-model="token" style="width: 50%" class="mb-2 channel-title" />
              <Button :label="t('toPlug')" @click="createChannel" :disabled="!token.length || !channelTitle.length" class="save-btn"></Button>
            </div>
          </div>
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