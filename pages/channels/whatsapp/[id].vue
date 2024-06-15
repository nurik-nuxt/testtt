<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";

const route = useRoute();
const channelStore = useChannelStore();

const qrCode = ref<string>('')

const fetchChannel = async () => {
  await channelStore.getChannelById(<string>route.params.id).then((res) => {
    if (res.qrCode.status === 'done') {
      qrCode.value = res.qrCode.qrCode
    }
  })
}

onMounted(() => {
  fetchChannel();
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="mt-4 mb-4">WhatsApp</h5>
        <img v-if="qrCode.length" :src="qrCode" alt="qrCode">
      </div>
    </div>
  </div>
</template>