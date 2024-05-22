<script setup lang="ts">
import AppDefaultLayout from '@/src/app/layouts/app-defaults/ui.vue'
import { BaseSpinner } from "~/src/shared/components/base";
import { useLoaderStore } from "~/src/shared/store/loader";
import { storeToRefs } from "pinia";
const loaderStore = useLoaderStore();

let { loading } = storeToRefs(loaderStore)
</script>

<template>
  <app-default-layout>
    <BaseSpinner :spinning="loading" />
    <slot />
  </app-default-layout>
</template>