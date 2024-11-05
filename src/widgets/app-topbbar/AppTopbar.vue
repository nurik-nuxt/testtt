<script setup>
import { useLayout } from '~/composable';
import { useAuthStore } from "~/src/shared/store/auth";
import { useNotificationStore } from "~/src/shared/store/notification";
import { useSubscriptionStore } from "~/src/shared/store/subscription";
import { socket } from "~/notification";
import jsCookie from 'js-cookie';

const notificationStore = useNotificationStore();
const subscriptionStore = useSubscriptionStore();

onUnmounted(() => {
  socket.disconnect();
})
onMounted(async () => {
  await notificationStore.getNotificationList();
  await subscriptionStore.loadSubscriptionsTariff();
  socket.connect();
});

const subscriptions = computed(() => {
  return subscriptionStore.getSubscriptions
});

const { layoutConfig, layoutState, onMenuToggle, showLanguageDialog, setToggleChat, chatVisible } = useLayout();
const authStore = useAuthStore();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

onMounted(() => {
  bindOutsideClickListener();
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const notifications = computed(() => {
  return notificationStore.getNotifications
})
const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
  topbarMenuActive.value = false;
  router.push('/settings');
};
const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector('.layout-topbar-menu');
  const topbarEl = document.querySelector('.layout-topbar-menu-button');

  return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
const userIdToImpersonate = ref('');
const applyImpersonate = async () => {
  await authStore.makeImpersonate(userIdToImpersonate.value).then(() => {
    window.location.reload();
  })
}

const notificationColorClass = computed(() => {
  const importance = notifications[0]?.importance;
  if (importance === 3) return 'notification-red';
  if (importance === 1) return 'notification-green';
  if (importance === 2) return 'notification-yellow';
  return 'notification-yellow';
})

const logoutSupport = () => {
  jsCookie.remove('supportAccessToken')
  jsCookie.remove('supportRefreshToken')
  jsCookie.remove('supportedUserEmail')
  jsCookie.remove('supportName')
  jsCookie.remove('supportPhone')
  window.location.reload();
}

</script>


<template>
  <div class="layout-topbar">

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>


    <nuxt-link v-if="authStore.isAdmin" to="/" class="layout-topbar-logo">
      <span class="layout-topbar-logo-text">Admin</span>
    </nuxt-link>
    <div v-else-if="authStore.isSupport" class="flex align-items-center gap-4">
      <span>{{ $t('idClient') }}:</span>
      <InputText type="text" v-model="userIdToImpersonate" />
      <Button :disabled="!userIdToImpersonate.length" :label="t('apply')" @click="applyImpersonate"/>
      <span style="color: red" v-if="authStore.supportedUserEmail">{{ authStore.supportedUserEmail }}</span>
      <i class="pi pi-sign-out ml-auto" style="cursor: pointer" @click="logoutSupport"></i>
    </div>
    <nuxt-link v-else to="/" class="layout-topbar-logo">
      <span class="layout-topbar-logo-text">7sales</span>
    </nuxt-link>
    <div v-if="!authStore.isSupport" class="flex justify-content-between w-full">
      <div style="font-weight: 700;" :class="notificationColorClass">
        {{ notifications[0]?.message }}
      </div>
      <div style="font-weight: 700; color: rgb(25, 201, 39)" v-if="subscriptions[0]?.billing_cycles[0]?.limit">{{ subscriptions[0]?.billing_cycles[0]?.usage }} / {{ subscriptions[0]?.billing_cycles[0]?.limit }}</div>
    </div>



    <button v-if="!chatVisible && route?.name ==='chatbots-id'" style="margin-left: auto" class="mobile-chat-toggle p-link layout-topbar-menu-button layout-topbar-button" @click="setToggleChat(true)">
      <i class="pi pi-comments"></i>
    </button>
    <button v-if="chatVisible && route?.name ==='chatbots-id'" style="margin-left: auto" class="mobile-chat-toggle p-link layout-topbar-menu-button layout-topbar-button" @click="setToggleChat(false)">
      <i style="color: #076AE1;" class="pi pi-comments"></i>
    </button>
    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <button class="p-link layout-topbar-button" @click="showLanguageDialog(true)">
        <i style="color: #076AE1;" class="pi pi-globe"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.mobile-chat-toggle {
  display: none;
}
@media (max-width: 600px) {
  .mobile-chat-toggle {
    display: block;
  }
}

.notification-red {
  color: red;
}

.notification-green {
  color: rgb(25, 201, 39);
}

.notification-yellow {
  color: rgb(249, 117, 62);
}
</style>
