<script setup lang="ts">
import AppTopbar from '@/src/widgets/app-topbbar/AppTopbar.vue'
import { AppSidebar } from '~/src/widgets/app-sidebar';
import { useLayout } from '~/composable';

const { layoutConfig, layoutState, isSidebarActive, languageDialog, showLanguageDialog } = useLayout();

const outsideClickListener = ref(null);

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener();
  } else {
    unbindOutsideClickListener();
  }
});

const containerClass = computed(() => {
  return {
    'layout-theme-light': layoutConfig.darkTheme.value === 'light',
    'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
    'layout-overlay': layoutConfig.menuMode.value === 'overlay',
    'layout-static': layoutConfig.menuMode.value === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive.value,
    'layout-mobile-active': layoutState.staticMenuMobileActive.value,
    'p-ripple-disabled': layoutConfig.ripple.value === false
  };
});
const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive.value = false;
        layoutState.staticMenuMobileActive.value = false;
        layoutState.menuHoverActive.value = false;
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
  const sidebarEl = document.querySelector('.layout-sidebar');
  const topbarEl = document.querySelector('.layout-menu-button');

  return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const { locale, locales, setLocale } = useI18n();


watch(
    () => locale.value,
    (code) => {
      setLocale(code);
      localStorage.setItem('lang',code);
      useHead({
        htmlAttrs: {
          lang: code,
        },
      });
      showLanguageDialog(false);
    },
    { deep: true }
)
</script>

<template>
  <Toast />
  <div class="layout-wrapper" :class="containerClass">
    <app-topbar />
    <div class="layout-sidebar">
      <app-sidebar></app-sidebar>
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <slot />
        <Dialog v-model:visible="languageDialog" :style="{ width: '450px' }" header="Выберите язык" :modal="true" class="p-fluid">
          <Dropdown v-model="locale" :options="locales" optionLabel="name" option-value="code" class="w-full" />
        </Dialog>
      </div>
    </div>
  </div>
</template>