<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";

const channelStore = useChannelStore();
const channelStatus = ref('');
const { t } = useI18n();
const route = useRoute();
const channelTitle = ref<string>('')
const token = ref<string>('')
const fetchChannel = async () => {
  await channelStore.getChannelById(<string>route.params.id).then((res) => {
    channelStatus.value = res.status;
    channelTitle.value = res.title;
    token.value = res.token
  })
}

onMounted(() => {
    fetchChannel();
})

const changeChannelStatus = async (status: string) => {
    await channelStore.changeStatusChannelById(<string>route.params.id, status, channelTitle.value).then((res) => {
      if (res.success) {
        fetchChannel();
      }
    })
}

const changeChannel = async () => {
  await channelStore.changeStatusChannelById(<string>route.params.id, channelStatus.value, channelTitle.value, token.value).then((res) => {
    if (res.success) {
      fetchChannel();
    }
  })
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="mt-4">{{ $t('connectingTelegramBot') }}</h5>
        <div class="flex w-full gap-8">
          <div class="flex flex-column gap-4">
            <div class="flex align-items-center gap-3">
              <div>{{ $t('status') }}:</div>
              <div v-if="channelStatus === 'active'">{{ $t('connected')}}</div>
              <div v-else>{{ $t('disconnected')}}</div>
              <Button v-if="channelStatus === 'active'" :label="t('disable')" severity="danger" @click="changeChannelStatus('off')"></Button>
              <Button v-else :label="t('toPlug')"  @click="changeChannelStatus('active')"></Button>
            </div>
            <div class="flex gap-3 align-items-center">
              <div>{{ $t('channelStatus') }}</div>
              <div class="flex flex-wrap gap-3">
                <div class="flex align-items-center">
                  <RadioButton v-model="channelStatus" inputId="active" name="active" value="active" />
                  <label for="active" class="ml-2">{{ $t('included') }}</label>
                </div>
                <div class="flex align-items-center">
                  <RadioButton v-model="channelStatus" inputId="off" name="off" value="off" />
                  <label for="off" class="ml-2">{{ $t('switchedOff') }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-column gap-2 mt-3">
          <div class="flex flex-column gap-2 mb-2">
            <label for="channelTitle" style="font-weight: 700">{{ $t('channelNameOnly') }} <span style="color: red">*</span></label>
            <InputText id="channelTitle" type="text" v-model="channelTitle" class="channel-title" />
          </div>
          <InputText id="token" type="text" placeholder="tokken:telegrambota" v-model="token" class="channel-title mb-2"/>
          <Button :label="t('save')" @click="changeChannel" :disabled="!token?.length || !channelTitle?.length" class="save-btn"></Button>
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