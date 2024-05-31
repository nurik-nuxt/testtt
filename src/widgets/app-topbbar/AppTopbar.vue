<script setup>
import { useLayout } from '~/composable';
import { useAuthStore } from "~/src/shared/store/auth";


const { layoutConfig, onMenuToggle, showLanguageDialog } = useLayout();
const authStore = useAuthStore();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const { t } = useI18n();

onMounted(() => {
  bindOutsideClickListener();
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const logoUrl = computed(() => {
  return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

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

const languageDialog = ref(false);
</script>


<template>
  <div class="layout-topbar">
    <nuxt-link v-if="authStore.isAdmin" to="/" class="layout-topbar-logo">
      <span class="layout-topbar-logo-text">Admin</span>
    </nuxt-link>
    <div v-else-if="authStore.isSupport" class="flex align-items-center gap-4">
      <span>{{ $t('idClient') }}:</span>
      <InputText type="text" value="467897" />
      <Button :label="t('apply')"/>
    </div>
    <nuxt-link v-else to="/" class="layout-topbar-logo">
      <span class="layout-topbar-logo-text">7sales</span>
    </nuxt-link>


    <button v-if="!authStore.isSupport" class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
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
