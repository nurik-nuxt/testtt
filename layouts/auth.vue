<script lang="ts" setup>
import { useLayout } from "~/composable";
const { languageDialog, showLanguageDialog } = useLayout();
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
  <div>
    <Dialog v-model:visible="languageDialog" :style="{ width: '450px' }" header="Выберите язык" :modal="true" class="p-fluid">
      <Dropdown v-model="locale" :options="locales" optionLabel="name" option-value="code" class="w-full" />
    </Dialog>
    <slot />
  </div>
</template>