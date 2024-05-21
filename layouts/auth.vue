<script lang="ts" setup>
import { useLayout } from "~/composable";
import { BaseSpinner } from "~/src/shared/components/base";
import { useLoaderStore } from "~/src/shared/store/loader";
import {storeToRefs} from "pinia";

const { languageDialog, showLanguageDialog } = useLayout();
const { locale, locales, setLocale } = useI18n();
const loaderStore = useLoaderStore();

let { loading } = storeToRefs(loaderStore)

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
  <div>
    <BaseSpinner :spinning="loading" />
    <Dialog v-model:visible="languageDialog" :style="{ width: '450px' }" header="Выберите язык" :modal="true" class="p-fluid">
      <Dropdown v-model="locale" :options="locales" optionLabel="name" option-value="code" class="w-full" />
    </Dialog>
    <slot />
  </div>
</template>