<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";

const channelStatus = ref('');
const step = ref<number | null>(1)
const { t } = useI18n();

const channelStore = useChannelStore();

const type = ref<string>('telegram');
const token = ref<string>('')

const createChannel = async () => {
  await channelStore.createNewChannel({
    type: type.value,
    token: token.value
  }).then((res) => {
    if (res.success) {
      return navigateTo({ name: 'chatbots-channel-telegram-id', params: { id: res?.channel?._id }})
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
              <InputText id="token" type="text" placeholder="tokken:telegrambota" v-model="token" />
              <Button :label="t('toPlug')" @click="createChannel"></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>