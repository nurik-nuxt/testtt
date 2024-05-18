<script setup lang="ts">
import { AppMenuItem } from "~/src/shared/components/app-menu-item";
import {it} from "node:test";

interface MenuItem {
  label: string;
  url: string;
  icon: string;
}
const menu = ref<MenuItem[]>([
  {
    label: 'Чат-боты',
    icon: 'pi pi-fw pi-android',
    url: 'chatbots'
  },
  {
    label: 'Тарифы',
    icon: 'pi pi-fw pi-star',
    url: 'tariffs'
  },
  {
    label: 'Диалоги',
    icon: 'pi pi-fw pi-envelope',
    url: 'dialogues'
  },
  {
    label: 'Логи',
    icon: 'pi pi-fw pi-prime',
    url: 'logs'
  },
  {
    label: 'Профиль',
    icon: 'pi pi-fw pi-user',
    url: 'cabinet'
  },
  {
    label: 'Регистрация',
    icon: 'pi pi-fw pi-user',
    url: 'registration'
  },
  {
    label: 'Помощь',
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