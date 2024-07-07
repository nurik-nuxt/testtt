<script setup lang="ts">
import { useChatStore } from "~/src/shared/store/chat";
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { socket } from "~/super-chat";
import { formatDate, convertTimestampToReadableDate } from "~/src/shared/utils/helpers"

const { t } = useI18n();
const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();

const currentMessage = ref([]);
const chatContentRef = ref<HTMLElement | null>(null);

function scrollToBottom() {
  if (chatContentRef.value) {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
  }
}

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
]);

async function fetchLeads() {
  await chatStore.getLeads();
}

onMounted(async () => {
  await fetchLeads();
});

watch(
    () => route.query.chat_id,
    (newChatId, oldChatId) => {
      if (newChatId !== oldChatId) {
        selectedChatId.value = newChatId;
      }
    }
);

const leads = computed(() => {
  return chatStore.allLeads.map(lead => ({
    ...lead,
    color: getRandomColor()
  }));
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const selectedChatId = ref<number | string | null>(null);

async function handleChatSelection(chatId: string | number) {
  selectedChatId.value = chatId;
  await chatStore.getLeadMessagesById(chatId).then(async (res) => {
    currentMessage.value = res
    await nextTick(); // Wait for the DOM to update
    scrollToBottom();
  });
  if (chatId) {
    socket.emit('joinedRoom')
  }
}

const chatLoading = computed(() => {
  return chatStore.getLoadingChat;
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card dialogue-wrapper">
        <div class="flex w-full" style="height: calc(100vh - 9rem);">
          <div class="user-list">
            <div class="flex align-items-center gap-2 mb-3">
              <IconField class="w-full" iconPosition="left">
                <InputText type="text" :placeholder="t('searchBase')" class="w-full" style="padding-top: 1rem; padding-bottom: 1rem; font-size: 16px" />
                <InputIcon class="pi pi-search" style="font-size: 16px" />
              </IconField>
              <SplitButton icon="pi pi-check" menuButtonIcon="pi pi-sliders-h" :model="items" />
            </div>
            <span>
              {{ $t('dialogsFound') }}: {{ leads?.length }}
            </span>
            <div class="user-list-scrollable">
              <div class="user-card mt-3" v-for="(lead, index) in leads" :key="index" @click="handleChatSelection(lead._id)" :class="{ 'active': selectedChatId === lead._id}">
                <div class="avatar-wrapper gap-2">
                  <Avatar :label="lead?.username?.charAt(0)" class="mr-2" size="large" shape="circle" :style="{ backgroundColor: lead.color, color: 'white' }" />
                  <div>
                    <div style="color: #2c2c2c" class="user-name" :class="{ 'active': selectedChatId === lead._id}">{{ lead?.username }}</div>
                    <div style="color: #adadad" class="last-message">{{ lead?.lastMessage?.message?.text }}</div>
                  </div>
                </div>
                <div style="color: #2c2c2c" :class="{ 'active': selectedChatId === lead._id}">{{ formatDate(lead?.lastMessage?.message?.created_at)}}</div>
              </div>
            </div>
          </div>
          <div v-if="selectedChatId" class="w-full flex flex-column chat-wrapper">
            <div class="chat-header">
              <div class="avatar-wrapper">
                <div style="width: 42px">
                  <Avatar :label="leads?.find((lead) => lead?._id === selectedChatId)?.username?.charAt(0)" class="mr-2" size="large" shape="circle" :style="{ backgroundColor: leads?.find((lead) => lead?._id === selectedChatId)?.color, color: 'white' }" />
                </div>
                <div>
                  <div class="selected-user-name">{{ leads?.find((lead) => lead?._id === selectedChatId)?.username }}</div>
                  <a target="_blank" href="https://t.me/systemsalex_bot/gift" style="color: #076AE1;">https://t.me/systemsalex_bot/gift</a>
                </div>
              </div>
              <div class="text-lg">
                {{ $t('pauseBot')}}
                <i style="cursor: pointer; font-size: 18px; margin-left: 8px; color: #1E63CE" class="pi pi-pause" />
              </div>
            </div>
            <div class="chat-loading" v-if="chatLoading">
              <ProgressSpinner />
            </div>
            <div v-else class="chat-content" ref="chatContentRef">
              <div v-for="(message, index) in currentMessage" :key="index" class="flex" :class="{'justify-content-end': message?.type === 'out'}">
                <div v-if="message?.type === 'inc'" class="message-client">
                  <div style="font-size: 16px">{{ message?.message?.text }}</div>
                  <div style="font-size: 14px; color: #b3b3b6">{{ convertTimestampToReadableDate(message?.message?.created_at) }}</div>
                </div>
                <div v-if="message?.type === 'out'" class="message-me">
                  <div style="font-size: 16px">{{ message?.message?.text }}</div>
                  <div style="font-size: 14px; margin-left: auto">{{ convertTimestampToReadableDate(message?.message?.created_at) }}</div>
                </div>
              </div>
            </div>
            <div class="chat-message">
              <IconField class="w-full" iconPosition="left">
                <InputIcon style="cursor: pointer; font-size: 18px;" class="pi pi-paperclip" @click="sendMessage"/>
                <Textarea type="text" id="message" class="w-full" :placeholder="t('enterMessage')" :autoResize="true" rows="2" cols="2" />
              </IconField>
              <i style="cursor: pointer; font-size: 18px;" class="pi pi-send" />
            </div>
          </div>
          <div class="empty-chat" v-else>
            <span class="empty-chat-message">{{ $t('selectChat') }}</span>
            <!-- Add content here for when no chat is selected, if needed -->
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
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chat-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  height: calc(100vh - 18rem); /* Adjust the height as needed */
  overflow-y: auto;
}
.user-list-scrollable {
  overflow-y: auto;
  flex-grow: 1;
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
  padding: 12px 8px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  &.active {
    background: #175cca;
  }
}
.user-card:hover {
  background: #175cca1f;
}
:deep(.p-splitbutton .p-splitbutton-defaultbutton) {
  display: none;
}
:deep(.p-splitbutton-menubutton) {
  border-radius: 6px;
  font-size: 18px;
}
:deep(.p-icon-field > .p-input-icon) {
  top: 47%;
}
.user-name {
  display: inline-block;
  width: 180px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  &.active {
    color: white !important;
  }
}
.active {
  color: white !important;
}

.last-message {
  line-height: 1.1;
  color: #adadad;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  width: 300px;
}

.selected-user-name {
  display: inline-block;
  width: 450px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}

.empty-chat {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-chat-message {
  background: #ECECED;
  color: #66666D;
  border-radius: 9999px;
  padding: 4px 12px;
}
.chat-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.message-client, .message-me {
  padding: 8px;
  border-radius: 10px;
  gap: 8px;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  word-wrap: break-word;
}

/* Specific styles for message-client */
.message-client {
  background-color: #fff !important;
  border-radius: 0 10px 10px 10px;
}

/* Specific styles for message-me */
.message-me {
  background-color: #175cca;
  color: #fff !important;
  border-radius: 10px 0 10px 10px;
  align-self: flex-end; /* Align message-me to the right */
}
</style>
