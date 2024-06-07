<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();
const value = ref('');
import Editor from 'primevue/editor';

</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <h5 class="font-bold">{{ $t('createKnowledgeTitle') }} {{ route.query.chatbot }}</h5>
        <Editor v-model="value" editorStyle="height: 320px" />
        <div class="mt-4 flex gap-4 align-items-center justify-content-end">
          <nuxt-link to="/chatbots" style="color: #334155">{{ $t('goBack')}}</nuxt-link>
          <Button :label="t('createFile')"></Button>
        </div>
      </div>
    </div>
  </div>
</template>