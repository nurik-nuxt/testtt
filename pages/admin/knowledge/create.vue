<script setup lang="ts">
console.log('Knowledge Create');
const route = useRoute();
</script>

<template>
  <div>
    Create Knowledge for Chatbot {{ route.query.chatbot }}
  </div>
</template>