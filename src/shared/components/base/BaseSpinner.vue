<script setup lang="ts">
interface BaseSpinnerProps {
  spinning: boolean;
}

const props = withDefaults(defineProps<BaseSpinnerProps>(), {
  spinning: false,
})
</script>

<template>
  <div class="spinner-overlay" v-show="spinning">
    <div class="spinner-ring">
      <ProgressSpinner />
    </div>
  </div>
</template>

<style>
.spinner-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2004;
  background-color: rgba(255, 255, 255, 0.5);
}

.spinner-ring {
  position: relative;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
}

.spinner-ring img {
  box-sizing: border-box;
  position: absolute;
  width: 48px;
  height: 48px;
  margin: 6px;
  border-radius: 50%;
  animation: spinner-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.spinner-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes spinner-ring {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
