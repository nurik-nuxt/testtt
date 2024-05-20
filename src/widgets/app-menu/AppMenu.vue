<script setup lang="ts">
import { AppMenuItem } from "~/src/shared/components/app-menu-item";
const { t } = useI18n();

interface MenuItem {
  label: string;
  url: string;
  icon: string;
}
const menu = computed(() => {
  return [
    {
      label: t('chatbots'),
      icon: 'pi pi-fw pi-android',
      url: 'chatbots'
    },
    {
      label: t('tariff'),
      icon: 'pi pi-fw pi-star',
      url: 'tariffs'
    },
    {
      label: t('message'),
      icon: 'pi pi-fw pi-envelope',
      url: 'dialogues'
    },
    {
      label: t('callAnalytics'),
      icon: 'pi pi-fw pi-sort-amount-up-alt',
      url: 'analytics'
    },
    {
      label: t('logs'),
      icon: 'pi pi-fw pi-prime',
      url: 'logs'
    },
    {
      label: t('partnerAccount'),
      icon: 'pi pi-fw pi-id-card',
      url: 'partner-cabinet'
    },
    {
      label: t('profile'),
      icon: 'pi pi-fw pi-user',
      url: 'cabinet'
    },
    {
      label: t('help'),
      icon: 'pi pi-fw pi-question-circle',
      url: 'support'
    },
    {
      label: 'Регистрация',
      icon: 'pi pi-fw pi-user',
      url: 'registration'
    },
  ]
})
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menu.slice(0,5)" :key="i">
      <app-menu-item :icon="item.icon" :label="item.label" :url="item.url" />
    </template>
    <div style="margin-top: auto;">
      <template v-for="(item, i) in menu.slice(5,8)" :key="i">
        <app-menu-item :icon="item.icon" :label="item.label" :url="item.url" />
      </template>
    </div>
  </ul>
</template>