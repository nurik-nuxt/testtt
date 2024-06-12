<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";

const channelStore = useChannelStore();
const channelStatus = ref('');
const { t } = useI18n();
const route = useRoute();

onMounted(async () => {
  await channelStore.getChannelById(<string>route.params.id).then((res) => {
    console.log(res);
    channelStatus.value = res.status
  })
})
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
              <div>{{ $t('connected')}}</div>
              <Button :label="t('disable')" severity="danger"></Button>
            </div>
            <div class="flex gap-3 align-items-center">
              <div>{{ $t('channelStatus') }}</div>
              <div class="flex flex-wrap gap-3">
                <div class="flex align-items-center">
                  <RadioButton v-model="channelStatus" inputId="active" name="active" value="active" />
                  <label for="ingredient1" class="ml-2">{{ $t('included') }}</label>
                </div>
                <div class="flex align-items-center">
                  <RadioButton v-model="channelStatus" inputId="switchedOff" name="switchedOff" value="switchedOff" />
                  <label for="ingredient2" class="ml-2">{{ $t('switchedOff') }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>