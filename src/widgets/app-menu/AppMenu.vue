<script setup lang="ts">
import { AppMenuItem } from "~/src/shared/components/app-menu-item";
const { t } = useI18n();

interface MenuItem {
  label: string;
  url: string;
  icon: string;
}
const menu = ref<MenuItem[]>([
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
    label: t('logs'),
    icon: 'pi pi-fw pi-prime',
    url: 'logs'
  },
  {
    label: t('profile'),
    icon: 'pi pi-fw pi-user',
    url: 'cabinet'
  },
  {
    label: 'Регистрация',
    icon: 'pi pi-fw pi-user',
    url: 'registration'
  },
  {
    label: t('help'),
    icon: 'pi pi-fw pi-question-circle',
    url: 'support'
  }
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menu.slice(0,4)" :key="i">
      <app-menu-item :icon="item.icon" :label="item.label" :url="item.url" />
    </template>
    <div style="margin-top: auto;">
      <template v-for="(item, i) in menu.slice(4,7)" :key="i">
        <app-menu-item :icon="item.icon" :label="item.label" :url="item.url" />
      </template>
    </div>
  </ul>
</template>