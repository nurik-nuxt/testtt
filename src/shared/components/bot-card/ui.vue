<script setup lang="ts">

interface PropsItem {
  name: string;
  id: number;
  botId: string;
  channels?: string[];
  isActive: boolean;
}
const props = withDefaults(defineProps<PropsItem>(), {
  channels(){
    return []
  }
});
const switchValue = ref<boolean>(true);

const editBot = () => {
  return navigateTo({ name: 'chatbots-id', params: { id: props.botId }})
}
</script>

<template>
  <div class="card-wrapper">
    <div class="bot-card">
      <h5 class="bot-card__title">{{ props.name ? props.name : `New bot ${id + 1}` }}</h5>
      <span class="bot-card__id">id: {{ props.botId }}</span>
      <div class="bot-card__channels">
        <span>{{ $t('channels') }}</span>
        <div class="bot-card__channels-list" v-if="props.channels?.length">
          <i v-if="props.channels.includes('instagram')" style="color: #ec4899" class="pi pi-instagram" />
          <i v-if="props.channels.includes('telegram')" style="color: #3B82F6" class="pi pi-telegram" />
          <i v-if="props.channels.includes('whatsapp')" style="color: #22c55e" class="pi pi-whatsapp" />
        </div>
        <div v-else>-</div>
      </div>
      <div class="bot-card__options">
        <div class="bot-card__edit">
          <button @click="editBot" class="bot-card__check flex item-center">{{ $t('settings') }}<span class="bot-card__edit-icon"><i class="pi pi-cog" style="cursor: pointer" /></span></button>
        </div>
        <span class="bot-card__activate">
            {{ $t('onOffButton') }}
            <InputSwitch v-model="switchValue" style="margin-left: 4px"/>
          </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>