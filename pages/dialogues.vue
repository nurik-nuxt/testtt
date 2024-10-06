<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { useChatStore } from '~/src/shared/store/chat';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { socket } from '~/super-chat';
import { formatDate, convertTimestampToReadableDate } from '~/src/shared/utils/helpers';
import { VirtualList } from 'vueuc'; // Импортируем VirtualList из Vueuc

const { t } = useI18n();
const chatStore = useChatStore();
const route = useRoute();

interface Message {
  messageId: string;
  channel: string;
  leadId: string;
  role: string;
  type: string;
  message: {
    text: string;
    created_at: number;
  };
}

interface Lead {
  _id: string;
  username: string;
  picture?: string;
  color: string;
  channel: string;
  link: string;
  bot_stopped: boolean;
  lastMessage?: Message;
  messages?: {
    unreadMessageCount: number;
  };
}

const currentMessages = ref<Message[]>([]);
const chatContentRef = ref<HTMLElement | null>(null);

function scrollToBottom() {
  if (chatContentRef.value) {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
  }
}

const opDeleteUser = ref<any>(null);
const selectedLeadId = ref<string | null>(null);
const showMessage = ref<boolean>(false);

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
    label: 'Бот 2'
  }
]);

const searchQuery = ref('');

async function fetchLeads() {
  try {
    await chatStore.getLeads();
  } catch (error) {
    console.error('Error fetching leads:', error);
  }
}

onMounted(async () => {
  await fetchLeads();

  socket.connect();

  socket.on('message', handleIncomingMessage);
});

onUnmounted(() => {
  socket.off('message', handleIncomingMessage);
  socket.disconnect();
});

watch(
    () => route.query.chat_id,
    (newChatId, oldChatId) => {
      if (newChatId !== oldChatId) {
        selectedLeadId.value = newChatId as string;
      }
    }
);

const leads = computed(() => {
  return chatStore.allLeads as Lead[];
});

// Фильтрация списка пользователей по поисковому запросу
const filteredLeads = computed(() => {
  if (!searchQuery.value) {
    return leads.value;
  }
  return leads.value.filter((lead) =>
      lead.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Текущий выбранный пользователь
const selectedLead = computed(() => {
  return leads.value.find((lead) => lead._id === selectedChatId.value) || null;
});

const selectedChatId = ref<string | null>(null);

async function handleChatSelection(leadId: string) {
  if (window.innerWidth < 601) {
    showMessage.value = true;
  }
  selectedChatId.value = leadId;

  try {
    const messages = await chatStore.getLeadMessagesById(leadId);

    // Генерация уникальных идентификаторов для сообщений
    currentMessages.value = messages.map((msg) => ({
      ...msg,
      messageId: `${msg.leadId}_${msg.message.created_at}`
    }));

    chatStore.setUnreadMessageCountToZero(leadId);
    await nextTick();
    scrollToBottom();
    socket.emit('joinedRoom', { leadId });
  } catch (error) {
    console.error('Error loading chat messages:', error);
  }
}

const chatLoading = computed(() => chatStore.getLoadingChat);

async function deleteLeadMessages() {
  if (selectedLeadId.value) {
    try {
      const res = await chatStore.deleteAllMessageLead(selectedLeadId.value);
      if (res?.success) {
        opDeleteUser.value?.hide();
        selectedLeadId.value = null;
        await fetchLeads();
      }
    } catch (error) {
      console.error('Error deleting lead messages:', error);
    }
  }
}

async function deleteLead() {
  if (selectedLeadId.value) {
    try {
      const res = await chatStore.deleteLead(selectedLeadId.value);
      if (res?.success) {
        opDeleteUser.value?.hide();
        selectedLeadId.value = null;
        await fetchLeads();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  }
}

const messageText = ref<string>('');

async function sendMessage() {
  if (messageText.value.trim().length === 0 || !selectedChatId.value) return;

  const now = Date.now();
  const createdAt = Math.floor(now / 1000);
  const newMessage: Message = {
    messageId: `${selectedChatId.value}_${createdAt}`,
    channel: 'chat',
    leadId: selectedChatId.value,
    role: 'operator',
    type: 'out',
    message: {
      text: messageText.value,
      created_at: createdAt
    }
  };

  currentMessages.value.push(newMessage);
  socket.emit('message', {
    leadId: selectedChatId.value,
    text: messageText.value
  });
  messageText.value = '';
  await nextTick();
  scrollToBottom();
}

watch(currentMessages, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

function goToLeads() {
  showMessage.value = false;
  selectedChatId.value = null;
  currentMessages.value = [];
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

async function startBot(leadId: string) {
  try {
    await chatStore.startBot(leadId);
  } catch (error) {
    console.error('Error starting bot:', error);
  }
}

async function pauseBot(leadId: string) {
  try {
    await chatStore.stopBot(leadId);
  } catch (error) {
    console.error('Error stopping bot:', error);
  }
}

function handleIncomingMessage(message: Message) {
  if (message.leadId === selectedChatId.value) {
    currentMessages.value.push({
      ...message,
      messageId: `${message.leadId}_${message.message.created_at}`
    });
    scrollToBottom();
  }
}
</script>

<template>
  <div class="grid">
    <!-- Ваши компоненты OverlayPanel и Dialog остаются без изменений -->
    <!-- ... -->
    <div class="col-12">
      <div class="card dialogue-wrapper">
        <div class="flex w-full" style="height: calc(100vh - 9rem);">
          <!-- Список пользователей -->
          <div class="user-list">
            <div class="flex align-items-center gap-2 mb-3">
              <IconField class="w-full" iconPosition="left">
                <InputText
                    type="text"
                    :placeholder="t('searchBase')"
                    class="w-full"
                    style="padding-top: 1rem; padding-bottom: 1rem; font-size: 16px"
                    v-model="searchQuery"
                />
                <InputIcon class="pi pi-search" style="font-size: 16px" />
              </IconField>
              <SplitButton icon="pi pi-check" menuButtonIcon="pi pi-sliders-h" :model="items" />
            </div>
            <span>
              {{ $t('dialogsFound') }}: {{ filteredLeads.length }}
            </span>
            <!-- Используем VirtualList для списка пользователей -->
            <VirtualList
                :items="filteredLeads"
                item-size="70"
                class="user-list-scrollable"
                key-field="_id"
            >
              <template #default="{ item: lead, index }">
                <div
                    class="user-card mt-3"
                    :key="lead._id"
                    @click="handleChatSelection(lead._id)"
                    :class="{ 'active': selectedChatId === lead._id }"
                >
                  <!-- Ваш код для отображения пользователя -->
                  <!-- ... -->
                </div>
              </template>
            </VirtualList>
          </div>

          <!-- Окно чата -->
          <div v-if="selectedChatId" class="w-full flex flex-column chat-wrapper">
            <!-- Шапка чата -->
            <!-- ... -->
            <!-- Контент чата -->
            <div class="chat-loading" v-if="chatLoading">
              <ProgressSpinner />
            </div>
            <div v-else class="chat-content" ref="chatContentRef">
              <!-- Используем VirtualList для списка сообщений -->
              <VirtualList
                  :items="currentMessages"
                  item-size="80"
                  class="chat-content"
                  key-field="messageId"
              >
                <template #default="{ item: message, index }">
                  <div
                      :key="message.messageId"
                      class="flex"
                      :class="{ 'justify-content-end': message.type === 'out' }"
                  >
                    <div v-if="message.type === 'inc'" class="message-client">
                      <div style="font-size: 16px">{{ message.message.text }}</div>
                      <div style="font-size: 14px; color: #b3b3b6">
                        {{ convertTimestampToReadableDate(message.message.created_at) }}
                      </div>
                    </div>
                    <div class="flex flex-column gap-4" v-else-if="message.type === 'out'">
                      <div class="message-me">
                        <div style="font-size: 16px">{{ message.message.text }}</div>
                        <div style="font-size: 14px; margin-left: auto">
                          {{ convertTimestampToReadableDate(message.message.created_at) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </VirtualList>
            </div>
            <!-- Поле ввода сообщения -->
            <!-- ... -->
          </div>
          <!-- Пустой чат -->
          <div class="empty-chat" v-else>
            <span class="empty-chat-message">{{ $t('selectChat') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
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
  height: calc(100vh - 18rem);
  overflow-y: auto;
}
.user-list-scrollable {
  overflow-y: auto;
  flex-grow: 1;
}
.chat-wrapper {
  background: #f8f8f8;
}

.chat-wrapper-mobile {
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
  align-items: center;
  cursor: pointer;
  &.active {
    background: #175cca;
    .badge {
      background-color: #adadad;
    }
  }
  &:hover .date-hover {
    display: none;
  }
  &:hover .layout-topbar-button {
    display: block;
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
  width: 240px;
}

.selected-user-name {
  display: inline-block;
  width: 450px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.selected-user-name-mobile {
  display: inline-block;
  width: 200px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}

.bot-link-mobile {
  display: inline-block;
  width: 200px;
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

.date-hover {
  color: #2c2c2c;
}

.actions-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.layout-topbar-button {
  display: none;
}
.badge {
  background-color: #175cca;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 601px) {
  @supports (height: 100dvh) {
    .chat-content {
      height: calc(100dvh - 140px) !important; /* Adjust the height as needed */
    }
  }
  .message-client, .message-me {
    max-width: 300px !important;
  }
  .chat-content {
    height: calc(100vh - 140px); /* Adjust the height as needed */
  }
  .chat-loading {
    height: calc(100vh - 140px);
  }
  .chat-wrapper {
    display: none !important;
  }
  .empty-chat {
    display: none;
  }
  .user-list {
    width: 100% !important;
    padding: 8px!important;
  }
  .user-card {
    padding: 12px 4px !important;
  }
  .last-message {
    width: 150px !important;
  }
}
.lead-avatar {
  position: relative;
}
.lead-channel {
  position: absolute;
  right: 2px;
  bottom: 0;
}
</style>
