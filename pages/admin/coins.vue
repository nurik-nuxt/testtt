<script setup lang="ts">
console.log('Coins Control Page')
import { useCoins } from "~/src/shared/store/coins";

const coinsStore = useCoins();
onMounted(async () => {
  await coinsStore.getAllCoinTariff();
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">Coins Control Page</div>
    </div>
  </div>
</template>