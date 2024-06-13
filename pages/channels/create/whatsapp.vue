<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="mt-4 mb-4">WhatsApp</h5>
        <Button :label="t('toPlug')"></Button>
      </div>
    </div>
  </div>
</template>