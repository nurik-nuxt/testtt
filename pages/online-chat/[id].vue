<script setup lang="ts">

const { t } = useI18n();

const settingChatModal = ref(false);
const settingChatModalStep = ref(1);
const location = ref('onRight')
const title = ref('')
const scriptContent = ref(`<script src="https://cdn.pulse.is/livechat/loader.js" data-live-chat-id="6652d4f70945c9e2fa0df07b" async`);
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>{{ $t('addChatWidget') }}</h5>
        <div>{{ $t('communicateWithVisitors') }}</div>
        <Divider />
        <div class="flex flex-column gap-2 mt-3">
          <span class="font-bold">{{ $t('siteURL') }}</span>
          <InputText type="text" style="width: 500px" placeholder="https://miro.com/app/board/uXjVNl7m5k4=/"/>
        </div>
        <div class="flex justify-content-end mt-3">
          <Button :label="t('continue')" @click="settingChatModal = true"/>
        </div>
      </div>
      <Dialog v-model:visible="settingChatModal" modal>
        <template #container="{ closeCallback }">
          <div class="flex modal-container">
            <div v-if="settingChatModalStep === 1" class="flex flex-column p-4 h-full" style="width: 40%">
              <h5>{{ $t('customizeWidget') }}</h5>
              <div class="mb-3 font-bold">{{ $t('location') }}</div>
              <div class="flex align-items-center gap-3">
                <div class="flex align-items-center">
                  <RadioButton v-model="location" inputId="onLeft" name="onLeft" value="onLeft" />
                  <label for="ingredient2" class="ml-2">{{ $t('onLeft') }}</label>
                </div>
                <div class="flex align-items-center">
                  <RadioButton v-model="location" inputId="onRight" name="onRight" value="onRight" />
                  <label for="ingredient1" class="ml-2">{{ $t('onRight') }}</label>
                </div>
              </div>
              <div class="mt-3 mb-3 font-bold">{{ $t('widgetTitle') }}</div>
              <InputText type="text" v-model="title" :placeholder="t('writeToUs')"/>
              <div class="flex justify-content-end mt-auto">
                <Button :label="t('continue')" @click="settingChatModalStep = 2"/>
              </div>
            </div>
            <div v-else-if="settingChatModalStep === 2" class="flex flex-column p-4 h-full" style="width: 40%">
              <div class="font-bold mb-2">{{ $t('installationCode') }}</div>
              <IconField iconPosition="right" class="mb-3">
                <InputIcon class="pi pi-copy cursor-pointer"> </InputIcon>
                <Textarea class="mb-3 w-full" :autoResize="true" rows="3" cols="2" readonly :value="scriptContent"/>
              </IconField>
              <span>{{ $t('addCodeBeforeBody') }}</span>
              <div class="font-bold mb-2 mt-3">{{ $t('integrationStatus') }}</div>
              <InputText type="text" placeholder="https://7sales.pro/"/>
              <div class="flex flex-column gap-2 mt-3" style="width: 70%">
                <Button :label="t('checkInstallation')"/>
                <Button :label="t('skipInstallation')" link />
              </div>
            </div>
            <div class="chat-demo">
              <div class="pt-auto h-full flex flex-column justify-content-end align-items-end" :class="{ 'on-left-chat': location === 'onLeft' }">
                <div class="chat-wrapper">
                  <div class="chat-wrapper__header">
                    <div v-if="title" class="font-bold">{{ title }}</div>
                    <div v-else class="font-bold">{{ $t('writeToUs') }}</div>
                    <i class="pi pi-times"></i>
                  </div>
                </div>
                <div class="chat-body">
                  <div class="mt-auto flex flex-column gap-3 h-full justify-content-end">
                    <div class="flex justify-content-end">
                      <div class="chat-question">
                        {{ $t('helloQuestion') }}
                      </div>
                    </div>
                    <div class="flex justify-content-start">
                      <div class="chat-answer">
                        {{ $t('goodAfternoon') }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chat-footer">
                  <div style="color: rgba(0,0,0,.35)">{{ $t('sendMessage') }}</div>
                  <div class="flex justify-content-end mt-4" style="color: rgba(0,0,0,.35); font-size: 10px">{{ $t('freeOnlineChat') }}<a target="_blank" href="https://7sales.ai/" style="color: #076AE1; margin-left: 2px">7sales</a></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-dialog-header) {
  display: none;
}
.modal-container {
  height: calc(100vh - 20rem);
  width: 900px;
}
.chat-demo {
  background: #E6ECEC;
  padding: 16px;
  width: 70%;
  border-radius: 12px;
}
.chat-wrapper {
  width: 350px;
}
.chat-wrapper__header {
  display: flex;
  justify-content: space-between;
  background: #FFFFFF;
  padding: 8px 16px;
  border-radius: 16px 16px 0 0;
  align-items: center;
}
.chat-body {
  background: rgba(47,128,237,.12);
  height: 400px;
  width: 350px;
  padding: 16px 16px 24px;
}
.chat-question {
  width: 200px;
  padding: 10px 12px;
  background: rgba(47,128,237,.2);
  border-radius: 8px 8px 0 8px;
}
.chat-answer {
  width: 200px;
  padding: 10px 12px;
  background: #fff;
  border-radius: 8px 8px 8px 0;
}
.chat-footer {
  height: 68px;
  background: #fff;
  width: 350px;
  border-radius: 0 0 8px 8px;
  padding: 12px 9px 2px 9px;
}
.on-left-chat {
  align-items: flex-start !important;
}
:deep(.p-icon-field > .p-input-icon) {
  top: 20%;
}
</style>