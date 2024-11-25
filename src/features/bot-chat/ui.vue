<script setup lang="ts">
import { socket, state } from "~/socket";
import jsCookie from "js-cookie";

interface Props {
  botName: string;
  apiKeyType: string
}

const props = withDefaults(defineProps<Props>(), {
  botName: ''
})

const message = ref<string>('')
const isJoinedChat = ref<boolean>(false)
const route = useRoute();

const userId = computed(() => {
  const userCookie = jsCookie.get('user')
  const user = userCookie ? JSON.parse(userCookie) : null
  return user?._id
})

const joinToChat = () => {
  socket.emit('joinChat', { botId: <string>route.params.id, userId: userId.value })
  isJoinedChat.value = true
}

function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

const sendMessage = () => {
  if (!props.apiKeyType) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Заполняйте API Key и сохраните бота', life: 5000 })
  } else {
    if (!isJoinedChat.value) {
      joinToChat();
    }
    if (message.value.trim() !== '' ) {
      const currentMessage = message.value;

      setTimeout(() => {
        socket.emit('message', currentMessage)
      }, 1000)

      state.messages.unshift({ id: state.messages.length + 1, sender: 'Me', message: message.value });
      message.value = '';
    }
  }
}


onUnmounted(() => {
  socket.disconnect();
})

onMounted(() => {
  socket.connect();
})
</script>

<template>
  <div class="chat">
    <div class="layout-chat">
      <div class="card-chat h-full">
        <div class="flex justify-content-between align-items-center chat-header">
          <div>{{ $t('chatWithBot') }} <br>"<span style="font-weight: 500">{{ props?.botName }}</span>"</div>
          <i style="cursor: pointer; font-size: 18px;" class="pi pi-trash" @click="clearChat" />
        </div>
        <div class="chat-messages h-full">
          <div v-for="(message, index) in state.messages" :key="index" :class="{'user-message': message.sender === 'Me', 'bot-message': message.sender === 'Bot'}">
            {{ message.message }}
          </div>
        </div>
        <div class="mt-auto flex justify-content-between align-items-center gap-3 pb-3 px-2">
          <Textarea style="max-height: 80px" type="text" id="message" class="w-full" maxlength="1000" :autoResize="true" rows="1" cols="2" v-model="message" @keydown="handleKeyDown" />
          <i style="cursor: pointer; font-size: 18px; margin-right: 10px" class="pi pi-send" @click="sendMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat {
  min-width: 300px;
}

@media (max-width: 601px) {
  .chat {
    position: fixed;
    top: 70px;
    width: 100%;
    left: 0;
    bottom: 0;
    background: white;
    z-index: 1000;
  }
  .layout-chat {
    width: 100% !important;
    min-width: 100% !important;
    left: 0;
    height: calc(100vh - 70px) !important;
  }
}

@supports (height: 100dvh) {
  .layout-chat {
    height: calc(100dvh - 70px) !important;
  }
}

.layout-chat {
  width: 300px;
  min-width: 300px;
  height: calc(100vh - 9rem) !important;
  overflow-y: auto;
  position: fixed;
  right: 2rem;
}

.chat-header {
  border-bottom: 1px solid var(--surface-border);
  padding: 12px 8px 8px 8px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 10px;
  background-color: #fff;
  gap: 12px;
}

.user-message {
  text-align: right;
  color: white;
  padding: 9px;
  background-color: #175CCA;
  border-radius: 8px;
  display: inline-block;
  max-width: 80%;
  align-self: flex-end;
}
.bot-message {
  text-align: left;
  color: white;
  padding: 8px;
  background-color: green;
  border-radius: 8px;
  display: inline-block;
  max-width: 80%;
  align-self: flex-start;
}
</style>/