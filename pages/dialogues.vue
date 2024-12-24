<script setup lang="ts">
import { useChatStore } from "~/src/shared/store/chat";
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { socket } from "~/super-chat";
import { formatDate, convertTimestampToReadableDate, getBaseUrlBeforeRest } from "~/src/shared/utils/helpers"
import {useChannelStore} from "~/src/shared/store/channel";

const { t } = useI18n();
const chatStore = useChatStore();
const channelStore = useChannelStore();
const route = useRoute();

const currentMessage = ref<any[]>([]);
const chatContentRef = ref<HTMLElement | null>(null);

function scrollToBottom() {
  if (chatContentRef.value) {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
  }
}

const opDeleteUser = ref();
const selectedLeadId = ref<string | null>(null);
const showMessage = ref<boolean>(false);

const toggleDeleteUser = async (event, leadId) => {
  selectedLeadId.value = leadId;
  await nextTick();
  opDeleteUser.value.toggle(event);
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
  await Promise.all([
    chatStore.getLeads(),
    channelStore.getAllChannels()
  ])
}

const availableChannels = computed(() => {
  return channelStore.getChannels
})

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
const selectedChatChannel = ref<string | null>(null)

async function handleChatSelection(chatId: string | number, channel: string) {
  if (window.innerWidth < 601) {
    showMessage.value = true
  }
  selectedChatId.value = chatId;
  selectedChatChannel.value = channel;
  await chatStore.getLeadMessagesById(chatId).then(async (res) => {
    chatStore.setUnreadMessageCountToZero(chatId as string);
    currentMessage.value = res;
    await nextTick(); // Wait for the DOM to update
    scrollToBottom();
  });
  if (chatId) {
    socket.emit('joinedRoom');
  }
}

const chatLoading = computed(() => {
  return chatStore.getLoadingChat;
});

const deleteLeadMessage = async () => {
  if (selectedLeadId.value) {
    await chatStore.deleteAllMessageLead(selectedLeadId.value).then(async (res) => {
      if (res?.success) {
        opDeleteUser?.value?.hide();
        selectedLeadId.value = null
        await fetchLeads();
      }
    })
  }
}

const deleteMessage = async () => {
  if (selectedLeadId.value) {
    await chatStore.deleteLead(selectedLeadId.value).then(async (res) => {
      if (res?.success) {
        opDeleteUser?.value?.hide();
        selectedLeadId.value = null
        await fetchLeads();
      }
    })
  }
}

onUnmounted(() => {
  socket.disconnect();
})
onMounted(() => {
  socket.connect();
})

const messageText = ref<string>('')

const sendMessage = (channel: string, leadId: string, type: string, role: string, chat_id?: string, recipient_id?: string) => {
  if (messageText.value.length) {
    const now = new Date();
    const createdAt = Math.floor(now.getTime() / 1000);
    const newMessage = {
      channel: channel,
      leadId: leadId,
      role: role,
      type: type,
      message: {
        text: messageText.value,
        created_at: createdAt
      }
    };
    currentMessage.value.push(newMessage);
    socket.emit('message',{
      leadId: selectedChatId.value,
      text: messageText.value
    });
    messageText.value = '';

    currentMessage.value = [...currentMessage.value];
  }
}

watch(currentMessage, (newMessages) => {
  nextTick(() => {
    scrollToBottom();
  });
});

const goToLeads = () => {
  showMessage.value = false;
  selectedChatId.value = null;
  selectedChatChannel.value = null;
  currentMessage.value = []
}

function handleKeyDown(event: any, channel: string, leadId: string, type: string, role: string, chat_id?: string, recipient_id?: string) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage(channel, leadId, type, role);
  }
}

const startBot = async (chatId: string) => {
  await chatStore.startBot(chatId)
}

const pauseBot = async (chatId: string) => {
  await chatStore.stopBot(chatId)
}

socket.on('message', async (message) => {
  if (message?.lead?._id === selectedChatId.value) {
    await handleChatSelection(message?.lead?._id, message?.lead?.channel)
  }
})
</script>
<template>
  <div class="grid">
    <OverlayPanel ref="opDeleteUser">
      <div class="flex flex-column gap-3">
        <span @click="deleteLeadMessage" class="flex  gap-3 align-items-center cursor-pointer" style="font-size: 16px;">
          <i class="pi pi-eraser" style="font-size: 16px"></i>
          {{ $t('cleanHistory')}}
        </span>
        <span @click="deleteMessage" class="flex gap-3 align-items-center cursor-pointer" style="font-size: 16px; color: #EF4444">
          <i class="pi pi-trash" style="font-size: 16px"></i>
          {{ $t('deleteFile')}}
        </span>
      </div>
    </OverlayPanel>
    <Dialog v-model:visible="showMessage" modal position="right" style="border-radius: 0" :closable="false" class="custom-dialog" pt:root:class="m-0 max-h-full rounded-2xl"
            :pt="{
               header: {
                 class: 'p-0'
               },
               content: {
                 class: 'p-0'
               },
            }"
    >
      <template #header>
        <div class="chat-header">
          <div class="avatar-wrapper-mobile">
            <i style="color: #3B82F6; font-size: 18px; cursor: pointer" class="pi pi-arrow-left" @click="goToLeads"/>
            <div>
              <Avatar v-if="leads?.find((lead) => lead?._id === selectedChatId)?.picture" :image="leads?.find((lead) => lead?._id === selectedChatId)?.picture" class="mr-2" shape="circle" :style="{ backgroundColor: leads?.find((lead) => lead?._id === selectedChatId)?.color, color: 'white' }" />
              <Avatar v-else :label="leads?.find((lead) => lead?._id === selectedChatId)?.username?.charAt(0)" class="mr-2" shape="circle" :style="{ backgroundColor: leads?.find((lead) => lead?._id === selectedChatId)?.color, color: 'white' }" />
            </div>
            <div>
              <div class="selected-user-name-mobile">{{ leads?.find((lead) => lead?._id === selectedChatId)?.username }}</div>
              <template v-if="leads?.find((lead) => lead?._id === selectedChatId)?.channel === 'bitrix24'">
                <a target="_blank" :href="`${getBaseUrlBeforeRest(availableChannels?.find((item) => item?._id === (leads?.find((lead) => lead?._id === selectedChatId)?.source_id))?.webhook)}/crm/deal/details/${leads?.find((lead) => lead?._id === selectedChatId)?.amocrmLeadId}/`" class="bot-link-mobile">{{ `${getBaseUrlBeforeRest(availableChannels?.find((item) => item?._id === (leads?.find((lead) => lead?._id === selectedChatId)?.source_id))?.webhook)}/crm/deal/details/${leads?.find((lead) => lead?._id === selectedChatId)?.amocrmLeadId}/` }}</a>
              </template>
              <template v-else>
                <a target="_blank" :href="leads?.find((lead) => lead?._id === selectedChatId)?.link" style="color: #076AE1;" class="bot-link-mobile">{{ leads?.find((lead) => lead?._id === selectedChatId)?.link }}</a>
              </template>
<!--              <a target="_blank" :href="leads?.find((lead) => lead?._id === selectedChatId)?.link" style="color: #076AE1;" class="bot-link-mobile">{{ leads?.find((lead) => lead?._id === selectedChatId)?.link }}</a>-->
            </div>
          </div>
          <div class="text-lg">
            <i v-if="leads?.find((lead) => lead?._id === selectedChatId)?.bot_stopped" style="cursor: pointer; font-size: 18px; margin-left: 8px; color: #1E63CE" class="pi pi-play" @click="startBot(<string>selectedChatId)" />
            <i v-else style="cursor: pointer; font-size: 18px; margin-left: 8px; color: #1E63CE" class="pi pi-pause" @click="pauseBot(<string>selectedChatId)" />
          </div>
        </div>
      </template>
      <div class="w-full flex flex-column chat-wrapper-mobile">
        <div class="chat-loading" v-if="chatLoading">
          <ProgressSpinner />
        </div>
        <div v-else class="chat-content" ref="chatContentRef">
          <div v-for="(message, index) in currentMessage" :key="index" class="flex" :class="{'justify-content-end': message?.type === 'out'}">
            <div v-if="message?.type === 'inc'" class="message-client">
              <div style="font-size: 16px">{{ message?.message?.text }}</div>
              <div style="font-size: 14px; color: #b3b3b6">{{ convertTimestampToReadableDate(message?.message?.created_at) }}</div>
            </div>
            <div class="flex flex-column gap-4" v-if="message?.type === 'out'">
              <div class="message-me">
                <div style="font-size: 16px">{{ message?.message?.text }}</div>
                <div style="font-size: 14px;" class="flex align-center justify-content-between">
                  <div style="color: yellow" v-if="message?.role === 'assistant' && message?.message?.price > 0">{{ message?.message?.price?.toFixed(2).replace('.', ',') }}  руб.</div>
                  <div style="margin-left: auto">{{ convertTimestampToReadableDate(message?.message?.created_at) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-message">
          <IconField class="w-full" iconPosition="left">
            <InputIcon style="cursor: pointer; font-size: 18px;" class="pi pi-paperclip"/>
            <Textarea type="text" id="message" class="w-full" :placeholder="t('enterMessage')" :autoResize="true" rows="2" cols="2" v-model="messageText" />
          </IconField>
          <i style="cursor: pointer; font-size: 18px;" class="pi pi-send" @click="sendMessage(selectedChatChannel, <string>selectedChatId, 'out', 'operator')" />
        </div>
      </div>
    </Dialog>
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
              {{ $t('dialogsFound') }}: {{ leads?.length }} {{ selectedLeadId }}
            </span>
            <div class="user-list-scrollable">
              <div class="user-card mt-3" v-for="(lead, index) in leads" :key="index" @click="handleChatSelection(lead._id, lead.channel)" :class="{ 'active': selectedChatId === lead._id}">
                <div class="avatar-wrapper-mobile gap-2">
                  <div class="lead-avatar">
                    <Avatar v-if="lead?.picture" :image="lead?.picture" class="mr-2" size="large" shape="circle" :style="{ backgroundColor: lead.color, color: 'white' }" />
                    <Avatar v-else :label="lead?.username?.charAt(0)" class="mr-2" size="large" shape="circle" :style="{ backgroundColor: lead.color, color: 'white' }" />
                    <span class="lead-channel">
                      <i v-if="lead.channel === 'telegram'" style="color: #3B82F6; font-size: 18px" class="pi pi-telegram" />
                      <i v-if="lead.channel === 'whatsapp'" style="color: #22c55e; font-size: 18px" class="pi pi-whatsapp" />
                      <span v-if="lead.channel === 'avito'" style="width: 18px">
                         <svg width="18px" height="18px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                         <circle cx="60" cy="140" r="40" fill="#59ff59"/>
                        <circle cx="140" cy="140" r="30" fill="#ff5959"/>
                        <circle cx="140" cy="80" r="50" fill="#59a1ff"/>
                        <circle cx="80" cy="60" r="20" fill="#a159ff"/>
                        </svg>
                        </span>
                      <span v-if="lead.channel === 'amocrm'" style="width: 18px">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 30 30" version="1.1">
                          <defs>
                            <filter id="alpha" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
                              <feColorMatrix type="matrix" in="SourceGraphic" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
                            </filter>
                            <mask id="mask0">
                              <g filter="url(#alpha)">
                                <rect x="0" y="0" width="30" height="30" style="fill:rgb(0%,0%,0%);fill-opacity:0.913725;stroke:none;"/>
                              </g>
                            </mask>
                            <clipPath id="clip1">
                              <rect x="0" y="0" width="30" height="30"/>
                            </clipPath>
                            <g id="surface5" clip-path="url(#clip1)">
                              <path style=" stroke:none;fill-rule:evenodd;fill:rgb(96.862745%,98.431373%,99.215686%);fill-opacity:1;" d="M 12.359375 0.972656 C 20.851562 0.421875 26.265625 4.21875 28.609375 12.359375 C 29.292969 20.855469 25.542969 26.273438 17.359375 28.609375 C 8.863281 29.292969 3.449219 25.542969 1.109375 17.359375 C 0.460938 8.839844 4.210938 3.378906 12.359375 0.972656 Z M 12.359375 0.972656 "/>
                            </g>
                          </defs>
                          <g id="surface1">
                            <use xlink:href="#surface5" mask="url(#mask0)"/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(21.960784%,60.784314%,82.352941%);fill-opacity:1;" d="M 24.027344 5.972656 C 23.675781 6.496094 23.167969 6.773438 22.5 6.804688 C 17.027344 6.609375 11.5625 6.609375 6.109375 6.804688 C 5.753906 6.570312 5.800781 6.246094 6.25 5.832031 C 6.1875 5.722656 6.09375 5.675781 5.972656 5.695312 C 11.085938 1.34375 16.546875 0.925781 22.359375 4.445312 C 22.886719 5.019531 23.445312 5.527344 24.027344 5.972656 Z M 24.027344 5.972656 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(18.039216%,58.431373%,81.176471%);fill-opacity:1;" d="M 5.972656 5.695312 C 6.09375 5.675781 6.1875 5.722656 6.25 5.832031 C 5.800781 6.246094 5.753906 6.570312 6.109375 6.804688 C 11.5625 6.609375 17.027344 6.609375 22.5 6.804688 C 23.167969 6.773438 23.675781 6.496094 24.027344 5.972656 C 26.746094 8.632812 27.902344 11.875 27.5 15.695312 C 27.21875 15.925781 26.894531 16.019531 26.527344 15.972656 C 27.019531 13.636719 26.183594 12.847656 24.027344 13.609375 C 23.261719 14.738281 23.355469 15.804688 24.304688 16.804688 C 22.226562 17.269531 21.535156 16.4375 22.222656 14.304688 C 23.105469 13.191406 24.261719 12.636719 25.695312 12.640625 C 23 11.207031 21.148438 11.945312 20.140625 14.859375 C 20.046875 14.859375 19.953125 14.859375 19.859375 14.859375 C 20.230469 12.777344 19.398438 11.992188 17.359375 12.5 C 17.125 12.785156 16.847656 13.015625 16.527344 13.195312 C 15.71875 11.613281 14.652344 11.429688 13.332031 12.640625 C 13.15625 12.136719 12.832031 11.769531 12.359375 11.527344 C 11.746094 11.921875 11.328125 12.480469 11.109375 13.195312 C 10.804688 14.28125 10.621094 15.394531 10.554688 16.527344 C 10.273438 16.761719 9.949219 16.851562 9.582031 16.804688 C 9.453125 15.441406 9.640625 14.144531 10.140625 12.917969 C 10.132812 12.492188 9.945312 12.167969 9.582031 11.945312 C 8.515625 11.902344 7.40625 11.902344 6.25 11.945312 C 5.269531 12.601562 4.4375 13.386719 3.75 14.304688 C 3.769531 14.183594 3.722656 14.089844 3.609375 14.027344 C 3.414062 14.4375 3.089844 14.621094 2.640625 14.582031 C 2.683594 13.929688 2.636719 13.28125 2.5 12.640625 C 2.359375 14.023438 2.316406 15.414062 2.359375 16.804688 C 1.554688 12.46875 2.757812 8.765625 5.972656 5.695312 Z M 5.972656 5.695312 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(16.470588%,56.862745%,80.392157%);fill-opacity:1;" d="M 7.359375 12.917969 C 7.6875 12.855469 7.964844 12.949219 8.195312 13.195312 C 7.984375 14.105469 7.847656 15.03125 7.777344 15.972656 C 7.210938 17.085938 6.46875 17.273438 5.554688 16.527344 C 5.417969 14.949219 6.019531 13.746094 7.359375 12.917969 Z M 7.359375 12.917969 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(29.411765%,62.352941%,82.745098%);fill-opacity:1;" d="M 25.140625 14.304688 C 25.457031 14.386719 25.644531 14.617188 25.695312 15 C 25.601562 15.230469 25.507812 15.464844 25.417969 15.695312 C 25.152344 15.265625 25.058594 14.800781 25.140625 14.304688 Z M 25.140625 14.304688 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(55.686275%,75.686275%,89.019608%);fill-opacity:1;" d="M 19.859375 14.859375 C 19.953125 14.859375 20.046875 14.859375 20.140625 14.859375 C 20.222656 15.535156 20.132812 16.183594 19.859375 16.804688 C 19.5 16.117188 19.5 15.46875 19.859375 14.859375 Z M 19.859375 14.859375 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(14.117647%,55.686275%,79.607843%);fill-opacity:1;" d="M 3.75 14.304688 C 2.769531 17.253906 3.785156 18.59375 6.804688 18.332031 C 7.300781 18.117188 7.71875 17.792969 8.054688 17.359375 C 8.488281 18.441406 9.226562 18.71875 10.277344 18.195312 C 10.980469 18.90625 11.671875 18.90625 12.359375 18.195312 C 12.589844 17.09375 12.730469 15.984375 12.777344 14.859375 C 12.9375 13.96875 13.445312 13.507812 14.304688 13.472656 C 14.257812 15.140625 14.304688 16.808594 14.445312 18.472656 C 14.96875 18.710938 15.476562 18.617188 15.972656 18.195312 C 15.707031 16.613281 16.078125 15.179688 17.082031 13.890625 C 17.347656 13.753906 17.625 13.707031 17.917969 13.75 C 17.886719 14.679688 17.792969 15.605469 17.640625 16.527344 C 17.613281 17.203125 17.796875 17.804688 18.195312 18.332031 C 19.011719 18.433594 19.796875 18.292969 20.554688 17.917969 C 21.738281 18.46875 22.988281 18.609375 24.304688 18.332031 C 25.144531 17.492188 26.160156 17.167969 27.359375 17.359375 C 27.214844 18.480469 26.84375 19.5 26.25 20.417969 C 26.023438 20.160156 25.792969 19.878906 25.554688 19.582031 C 18.496094 19.882812 11.367188 19.882812 4.167969 19.582031 C 3.800781 19.757812 3.570312 20.035156 3.472656 20.417969 C 2.804688 19.332031 2.4375 18.128906 2.359375 16.804688 C 2.316406 15.414062 2.359375 14.023438 2.5 12.640625 C 2.636719 13.28125 2.683594 13.929688 2.640625 14.582031 C 3.089844 14.621094 3.414062 14.4375 3.609375 14.027344 C 3.722656 14.089844 3.769531 14.183594 3.75 14.304688 Z M 3.75 14.304688 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(7.058824%,53.333333%,78.431373%);fill-opacity:1;" d="M 26.25 20.417969 C 25.910156 21.402344 25.355469 22.234375 24.582031 22.917969 C 18.101562 22.546875 11.621094 22.546875 5.140625 22.917969 C 4.367188 22.234375 3.8125 21.402344 3.472656 20.417969 C 3.570312 20.035156 3.800781 19.757812 4.167969 19.582031 C 11.367188 19.882812 18.496094 19.882812 25.554688 19.582031 C 25.792969 19.878906 26.023438 20.160156 26.25 20.417969 Z M 26.25 20.417969 "/>
                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(7.45098%,51.764706%,77.647059%);fill-opacity:1;" d="M 24.582031 22.917969 C 22.039062 26.15625 18.660156 27.730469 14.445312 27.640625 C 10.578125 27.488281 7.476562 25.914062 5.140625 22.917969 C 11.621094 22.546875 18.101562 22.546875 24.582031 22.917969 Z M 24.582031 22.917969 "/>
                          </g>
                        </svg>
                      </span>
                      <span v-if="lead.channel === 'bitrix24'" style="width: 18px">
                        <svg width="18px" height="18px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="512" cy="512" r="512" style="fill:#2fc7f7"/>
                          <path d="M877 499.07h-22v-22h-5.91V505H877zM852.07 543A43.93 43.93 0 1 1 896 499.07 44.17 44.17 0 0 1 852.07 543zm0-79.83a35.9 35.9 0 1 0 35.9 35.9 35.87 35.87 0 0 0-35.9-35.9zm-84.48 59.56v-70.12h-14.78l-56.18 73.07v13.94h50.69v27.88h20.27v-27.88h16.9v-16.9zm-20.27-16.47v16.04H733.8c-4.22 0-11.83.42-14.36.42l28.72-38.86c0 3.38-.84 13.52-.84 22.39zm-132.21 60.82h79v-17.32h-52.39c7.18-28.72 51.11-35.06 51.11-67.16 0-17.32-11.83-30-36.33-30a85.18 85.18 0 0 0-38 9.29L624 478c8.45-3.8 17.74-7.6 29.14-7.6 9.29 0 17.74 3.8 17.74 14.36.41 23.6-51.12 25.29-55.77 82.32zm-76.45-46.89-33.79-46.46h24.5l22 30.41 22.39-30.41h24.5L564 520.19l34.64 46.89h-24.5l-22.39-31.26-22.81 31.26h-24.5zm-73.92-75.61a14.36 14.36 0 0 1 28.72 0c0 7.6-6.34 13.94-14.78 13.94s-13.94-5.91-13.94-13.94zm2.53 29.14h23.65v93.35h-23.64zm-73.5 0h20.27l2.53 10.56c8.45-8.45 16.05-12.67 25.77-12.67a24.76 24.76 0 0 1 13.09 3.8L447 495.27a20.08 20.08 0 0 0-10.56-3c-6.34 0-11.4 2.53-19 9.29v65.94h-23.66zm-124.6-29.14a14.24 14.24 0 0 1 14.36-14.36c8 0 14.78 5.91 14.78 14.36 0 7.6-6.34 13.94-14.78 13.94s-14.36-5.91-14.36-13.94zm2.53 29.14h23.65v93.35h-23.64zm55.3 70.55v-52h-16.9v-18.54H327v-21.54l23.65-6.76v28.3H379l-5.91 18.59H350.7v46c0 8.87 3 11.83 9.29 11.83a26.42 26.42 0 0 0 14.36-4.65l7.18 16.05c-6.76 4.65-18.16 7.18-27.46 7.18-16.89.46-27.07-8.84-27.07-24.46zM164 437h38c27.88 0 40.55 16.05 40.55 32.95 0 11.4-5.49 21.54-15.63 27v.42c15.21 3.8 24.5 16.05 24.5 31.26 0 20.27-15.21 38.44-45.62 38.44H164zm35.06 54.49c13.09 0 20.27-7.18 20.27-17.32 0-9.71-6.34-17.32-20.27-17.32h-11v34.64zm3.8 56.18c15.63 0 24.5-5.91 24.5-19 0-11-8.45-17.74-21.54-17.74h-17.74v36.75z" style="fill:#fff"/>
                        </svg>
                      </span>
                   </span>
                  </div>
                  <div>
                    <div style="color: #2c2c2c" class="user-name" :class="{ 'active': selectedChatId === lead._id}">{{ lead?.username }}</div>
                    <div style="color: #adadad" class="last-message">{{ lead?.lastMessage?.message?.text }}</div>
                  </div>
                </div>
                <div class="actions-container">
                  <div class="flex flex-column gap-2 ali">
                    <div class="date-hover" :class="{ 'active': selectedChatId === lead._id}">{{ formatDate(lead?.lastMessage?.message?.created_at) }}</div>
                    <div class="badge ml-auto" v-if="lead?.messages?.unreadMessageCount">{{ lead?.messages?.unreadMessageCount }}</div>
                  </div>
                  <button class="p-link layout-topbar-menu-button layout-topbar-button" @click.stop="toggleDeleteUser($event, lead._id)">
                    <i class="pi pi-ellipsis-h" style="font-size: 18px"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectedChatId" class="w-full flex flex-column chat-wrapper">
            <div class="chat-header">
              <div class="avatar-wrapper">
                <div style="width: 42px">
                  <Avatar v-if="leads?.find((lead) => lead?._id === selectedChatId)?.picture" :image="leads?.find((lead) => lead?._id === selectedChatId)?.picture" class="mr-2" size="large" shape="circle" :style="{ backgroundColor: leads?.find((lead) => lead?._id === selectedChatId)?.color, color: 'white' }" />
                  <Avatar v-else :label="leads?.find((lead) => lead?._id === selectedChatId)?.username?.charAt(0)" class="mr-2" size="large" shape="circle" :style="{ backgroundColor: leads?.find((lead) => lead?._id === selectedChatId)?.color, color: 'white' }" />
                </div>
                <div>
                  <div class="selected-user-name">{{ leads?.find((lead) => lead?._id === selectedChatId)?.username }}</div>
                  <template v-if="leads?.find((lead) => lead?._id === selectedChatId)?.channel === 'bitrix24'">
                    <a target="_blank" :href="`${getBaseUrlBeforeRest(availableChannels?.find((item) => item?._id === (leads?.find((lead) => lead?._id === selectedChatId)?.source_id))?.webhook)}/crm/deal/details/${leads?.find((lead) => lead?._id === selectedChatId)?.amocrmLeadId}/`">{{ `${getBaseUrlBeforeRest(availableChannels?.find((item) => item?._id === (leads?.find((lead) => lead?._id === selectedChatId)?.source_id))?.webhook)}/crm/deal/details/${leads?.find((lead) => lead?._id === selectedChatId)?.amocrmLeadId}/` }}</a>
                  </template>
                  <template v-else>
                    <a target="_blank" :href="leads?.find((lead) => lead?._id === selectedChatId)?.link" style="color: #076AE1;">{{ leads?.find((lead) => lead?._id === selectedChatId)?.link }}</a>
                  </template>
                </div>
              </div>
              <div class="text-lg">
                <!-- {{ $t('pauseBot')}} -->
                <i v-if="leads?.find((lead) => lead?._id === selectedChatId)?.bot_stopped" style="cursor: pointer; font-size: 18px; margin-left: 8px; color: #1E63CE" class="pi pi-play" @click="startBot(<string>selectedChatId)" />
                <i v-else style="cursor: pointer; font-size: 18px; margin-left: 8px; color: #1E63CE" class="pi pi-pause" @click="pauseBot(<string>selectedChatId)" />
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
                <div class="flex flex-column gap-4" v-if="message?.type === 'out'">
                  <div class="message-me">
                    <div style="font-size: 16px">{{ message?.message?.text }}</div>
                    <div style="font-size: 14px;" class="flex align-center justify-content-between">
                      <div style="color: yellow" v-if="message?.role === 'assistant' && message?.message?.price > 0">{{ message?.message?.price?.toFixed(2).replace('.', ',') }}  руб.</div>
                      <div style="margin-left: auto">{{ convertTimestampToReadableDate(message?.message?.created_at) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="chat-message">
              <IconField class="w-full" iconPosition="left">
                <InputIcon style="cursor: pointer; font-size: 18px;" class="pi pi-paperclip"/>
                <Textarea style="max-height: 80px" type="text" id="message" class="w-full" maxlength="1000" :placeholder="t('enterMessage')" :autoResize="true" rows="1" cols="2" v-model="messageText" @keydown="handleKeyDown($event,<string>selectedChatChannel, <string>selectedChatId, 'out', 'operator')" />
              </IconField>
              <i style="cursor: pointer; font-size: 18px;" class="pi pi-send" @click="sendMessage(<string>selectedChatChannel, <string>selectedChatId, 'out', 'operator')" />
            </div>
          </div>
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
      height: calc(100dvh - 140px) !important;
    }
  }
  .message-client, .message-me {
    max-width: 300px !important;
  }
  .chat-content {
    height: calc(100vh - 140px);
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
