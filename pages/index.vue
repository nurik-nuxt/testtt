<script setup lang="ts">
console.log('Main Page')
const { t } = useI18n();

</script>

<template>
  <div>
    {{ $t('test') }}
  </div>
</template>
