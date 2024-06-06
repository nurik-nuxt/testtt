<script setup lang="ts">
import { socket } from "~/socket";

const isConnected = ref(false);
const transport = ref("N/A");

if (socket.connected) {
  onConnect();
}

function onConnect() {
  isConnected.value = true;
  transport.value = socket.io.engine.transport.name;

  socket.io.engine.on("upgrade", (rawTransport) => {
    transport.value = rawTransport.name;
  });
}

function onDisconnect() {
  isConnected.value = false;
  transport.value = "N/A";
}

socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);

onBeforeUnmount(() => {
  socket.off("connect", onConnect);
  socket.off("disconnect", onDisconnect);
});


const { t } = useI18n();

const items = ref([
  {
    id: 1,
    label: t('searchAllBots')
  },
  {
    id: 2,
    label: 'Бот 1'
  },
  {
    id: 3,
    label: 'Бот '
  }
])

const sendMessage = () => {
  console.log('sendMessage');
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div>
        <p>Status: {{ isConnected ? "connected" : "disconnected" }}</p>
        <p>Transport: {{ transport }}</p>
      </div>
      <div class="card dialogue-wrapper">
        <div class="flex w-full h-full">
          <div class="user-list h-full">
            <div class="flex align-items-center gap-2 mb-3">
              <IconField class="w-full" iconPosition="left">
                <InputText  type="text" :placeholder="t('searchBase')" class="w-full" style="padding-top: 1rem; padding-bottom: 1rem; font-size: 16px" />
                <InputIcon class="pi pi-search" style="font-size: 16px" />
              </IconField>
              <SplitButton icon="pi pi-check" menuButtonIcon="pi pi-sliders-h" :model="items" />
            </div>
            <span>
              {{ $t('dialogsFound') }}: 1
            </span>
            <div class="user-card mt-3">
              <div class="avatar-wrapper gap-2">
                <Avatar label="A" class="mr-2" size="large" shape="circle" />
                <div>
                  <div class="text-white">Alexander</div>
                  <div style="color: #D0C4C6">куку</div>
                </div>
              </div>
              <div class="text-white">пн</div>
            </div>
          </div>
          <div class="w-full flex flex-column chat-wrapper">
            <div class="chat-header">
              <div class="avatar-wrapper">
                <Avatar label="A" class="mr-2" size="large" shape="circle" />
                <div>
                  <div>Alexander</div>
                  <a target="_blank" href="https://t.me/systemsalex_bot/gift" style="color: #076AE1;">https://t.me/systemsalex_bot/gift</a>
                </div>
              </div>
              <div class="text-lg">
                {{ $t('pauseBot')}}
                <i style="cursor: pointer; font-size: 18px; margin-left: 8px; color: #1E63CE" class="pi pi-pause" />
              </div>
            </div>
            <div class="chat-content">
              chat-content
            </div>
            <div class="chat-message">
              <IconField class="w-full" iconPosition="left">
                <InputIcon style="cursor: pointer; font-size: 18px;" class="pi pi-paperclip" @click="sendMessage" />
                <Textarea type="text" id="message" class="w-full" :placeholder="t('enterMessage')" :autoResize="true" rows="2" cols="2" />
              </IconField>
              <i style="cursor: pointer; font-size: 18px;" class="pi pi-send" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialogue-wrapper {
  height: calc(100vh - 9rem);
  padding: 0;
}
.user-list {
  width: 500px;
  padding: 1rem;
  border-right: 1px solid var(--surface-border);
}
.chat-wrapper {
  background: #F8F8F8;
}
.chat-header {
  padding: 1rem;
  background: var(--surface-card);
  box-shadow: var(--card-shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chat-message {
  margin-top: auto;
  padding: 1rem;
  background: var(--surface-card);
  box-shadow: var(--card-shadow);
  display: flex;
  align-items: center;
  gap: 8px;
}
.user-card {
  background: #175CCA;
  padding: 12px 8px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
}
:deep(.p-splitbutton .p-splitbutton-defaultbutton){
  display: none;
}
:deep(.p-splitbutton-menubutton) {
  border-radius: 6px;
  font-size: 18px;
}

:deep(.p-icon-field > .p-input-icon) {
  top: 35%;
}
</style>