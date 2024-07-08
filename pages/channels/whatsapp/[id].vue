<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useIntervalFn } from "@vueuse/core";
import { useWhatsappStore } from "~/src/shared/store/whatsapp";

const route = useRoute();
const channelStore = useChannelStore();
const whatsappStore = useWhatsappStore();
const { t } = useI18n();

const qrCode = ref<string>('')
const channelTitle = ref<string>('')
const intervalStatusWhatsapp = ref<number>(5000);
const authorized = ref(false);
const channelStatus = ref('');



const fetchChannel = async () => {
  await channelStore.getChannelById(<string>route.params.id).then((res) => {
    channelStatus.value = res.status;
    channelTitle.value = res.title;
  })
}

const fetchWhatsappStatus = async () => {
  await whatsappStore.fetchWhatsappStatus(<string>route.params.id).then((res) => {
    authorized.value = res?.authorized
    console.log(authorized.value);
    if (!res.authorized) {
      fetchWhatsappQrStatus()
    }
  })
}

const fetchWhatsappQrStatus = async () => {
  await whatsappStore.fetchWhatsappQrStatus(<string>route.params.id).then((res) => {
    qrCode.value = res.qrCode
  })
}
useIntervalFn(() => {
  if (!authorized.value) {
    fetchWhatsappStatus();
  }
}, intervalStatusWhatsapp)

onMounted(() => {
  fetchChannel();
  fetchWhatsappStatus();
})
const changeChannelStatus = async (status: string) => {
  await channelStore.changeStatusChannelById(<string>route.params.id, status, channelTitle.value).then((res) => {
    if (res.success) {
      fetchChannel();
    }
  })
}
const changeChannel = async () => {
  await channelStore.changeStatusChannelById(<string>route.params.id, channelStatus.value, channelTitle.value).then((res) => {
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
        <h5 class="mt-4 mb-4">WhatsApp</h5>
        <div v-if="!authorized" class="whatsapp-wrapper">
          <div class="flex flex-column gap-3 qr-wrapper">
            <img :src="qrCode" alt="qrCode" class="qr-code">
            <span>{{ $t('textToPlugWA') }}</span>
          </div>
          <div class="flex flex-column gap-3">
            <span>{{ $t('instructionWaQr1')}}}</span>
            <span>{{ $t('instructionWaQr2')}}}</span>
            <span>{{ $t('instructionWaQr3')}}}</span>
          </div>
        </div>
        <div v-if="authorized" class="flex flex-column gap-4">
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
                <label for="switchedOff" class="ml-2">{{ $t('switchedOff') }}</label>
              </div>
            </div>
          </div>
          <div class="flex flex-column gap-2 mt-3">
            <div class="flex flex-column gap-2 mb-2">
              <label for="channelTitle" style="font-weight: 700">{{ $t('channelNameOnly') }} <span style="color: red">*</span></label>
              <InputText id="channelTitle" type="text" v-model="channelTitle" class="channel-title" />
            </div>
            <Button :label="t('save')" @click="changeChannel" :disabled="!channelTitle?.length" class="save-btn"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-code {
  width: 400px
}
.whatsapp-wrapper {
  display: flex;
}

@media (max-width: 601px) {
  .whatsapp-wrapper {
    flex-direction: column;
    gap: 12px
  }
  .qr-code {
    width: 200px
  }
}
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
  .qr-wrapper {
    width: 100% !important;
    align-items: center;
  }
}

.qr-wrapper {
  width: 50%
}
</style>