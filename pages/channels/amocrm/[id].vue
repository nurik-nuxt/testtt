<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useAmoCrmStore } from "~/src/shared/store/amocrm";

const channelStore = useChannelStore();
const amoCrmStore = useAmoCrmStore();

const route = useRoute();
const router = useRouter();
const channelStatus = ref('');
const { t } = useI18n();
const voronkas = ref([]);

const fetchChannel = async () => {
  const res = await channelStore.getChannelById(<string>route.params.id);
  channelStatus.value = res.status;
  channelTitle.value = res.title;
};

const fetchVoronki = async () => {
  voronkas.value = await amoCrmStore.fetchVoronki();
};

const fetchActiveFunnels = async () => {
  await amoCrmStore.fetchActiveFunnels(<string>route.params.id);
};

const activeFunnels = computed(() => {
  return amoCrmStore.getActiveFunnels;
});

const changeChannelStatus = async (status: string) => {
  const res = await channelStore.changeStatusChannelById(<string>route.params.id, status);
  if (res.success) {
    await fetchChannel();
  }
};

const refreshCrm = () => {
  router.go(0);
};

onMounted(() => {
  Promise.all([
    fetchChannel(),
    fetchVoronki(),
    fetchActiveFunnels(),
  ]);
});

const getStatusKey = (idFunnel: number, idStatus: number) => {
  return `${idFunnel}-${idStatus}`;
};

const isActiveStatus = (idFunnel: number, idStatus: number) => {
  return activeFunnels.value?.find((funnel: { pipeline_id: number }) => funnel.pipeline_id === idFunnel)?.active_statuses?.includes(idStatus);
};

const statusMap = ref(new Map());

const initializeStatusMap = () => {
  voronkas.value.forEach((voronka) => {
    voronka?._embedded?.statuses.forEach((status) => {
      const key = getStatusKey(voronka.id, status.id);
      statusMap.value.set(key, isActiveStatus(voronka.id, status.id));
    });
  });
};

watch(voronkas, initializeStatusMap);

const computedStatus = (idFunnel: number, idStatus: number) => {
  const key = getStatusKey(idFunnel, idStatus);
  return computed({
    get() {
      return statusMap.value.get(key) || false;
    },
    set(value) {
      statusMap.value.set(key, value);
    },
  });
};

const saveStatusMap = async () => {
  const pipelineStatusMap = new Map();

  statusMap.value.forEach((value, key) => {
    const [pipelineId, statusId] = key.split('-').map(Number);
    if (value) {
      if (!pipelineStatusMap.has(pipelineId)) {
        pipelineStatusMap.set(pipelineId, []);
      }
      pipelineStatusMap.get(pipelineId).push(statusId);
    }
  });

  const requestBody = Array.from(pipelineStatusMap.entries()).map(([pipeline_id, active_statuses]) => ({
    pipeline_id,
    active_statuses,
  }));

  await amoCrmStore.changeActiveStatus(requestBody, <string>route.params.id);
};

const channelTitle = ref<string>('');

const changeChannel = async () => {
  await channelStore.changeStatusChannelById(<string>route.params.id, channelStatus.value, channelTitle.value).then(() => {
    fetchChannel();
  });
};

// Voronka toggle logic
const voronkaToggleMap = ref(new Map());

const initializeVoronkaToggleMap = () => {
  voronkas.value.forEach((voronka) => {
    const allActive = voronka?._embedded?.statuses.every((status) =>
        isActiveStatus(voronka.id, status.id)
    );
    voronkaToggleMap.value.set(voronka.id, allActive);
  });
};

watch(voronkas, initializeVoronkaToggleMap);

const getVoronkaToggle = (voronkaId: number) => {
  return voronkaToggleMap.value.get(voronkaId) || false;
};

const setVoronkaToggle = (voronkaId: number, value: boolean) => {
  voronkaToggleMap.value.set(voronkaId, value);
  voronkas.value.forEach((voronka) => {
    if (voronka.id === voronkaId) {
      voronka?._embedded?.statuses.forEach((status) => {
        const key = getStatusKey(voronkaId, status.id);
        statusMap.value.set(key, value);
      });
    }
  });
};

const voronkaToggle = (voronkaId: number) => {
  return computed({
    get: () => getVoronkaToggle(voronkaId),
    set: (value: boolean) => setVoronkaToggle(voronkaId, value),
  });
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="font-bold">AmoCRM</h5>
        <div class="channel-wrapper">
          <div class="flex flex-column gap-4">
            <Button v-if="channelStatus === 'active'" :label="t('disableAmoCRM')" severity="danger" @click="changeChannelStatus('off')" />
            <Button v-else :label="t('connectAmoCRM')" @click="changeChannelStatus('active')" />
            <Button :label="t('updateDataCRM')" severity="contrast" outlined @click="refreshCrm" />
            <div class="flex gap-3 align-items-center">
              <div>{{ $t('channelStatus') }}</div>
              <div class="flex flex-wrap gap-3">
                <div class="flex align-items-center">
                  <RadioButton v-model="channelStatus" inputId="active" name="active" value="active" />
                  <label for="active" class="ml-2">{{ $t('included') }}</label>
                </div>
                <div class="flex align-items-center">
                  <RadioButton v-model="channelStatus" inputId="off" name="off" value="off" />
                  <label for="off" class="ml-2">{{ $t('switchedOff') }}</label>
                </div>
              </div>
            </div>
            <div class="flex flex-column gap-2 mb-4">
              <label for="channelTitle" style="font-weight: 700">{{ $t('channelNameOnly') }} <span style="color: red">*</span></label>
              <InputText id="channelTitle" type="text" v-model="channelTitle" />
              <Button :label="t('change')" @click="changeChannel" :disabled="!channelTitle?.length"></Button>
            </div>
          </div>
          <div class="flex flex-column gap-4" style="width: 50%">
            <h5>{{ $t('instructionsConnectAmoCRM') }}</h5>
            <span>{{ $t('instructionTextAmo1') }}</span>
            <span>{{ $t('instructionTextAmo2') }}</span>
            <span>{{ $t('instructionTextAmo3') }}</span>
            <span>{{ $t('instructionTextAmo4') }}</span>
          </div>
        </div>
        <div class="flex flex-column mt-5 gap-3">
          <h5 class="font-bold">{{ $t('funnelInAmoCRM') }}</h5>
          <div class="voronka" v-for="voronka in voronkas" :key="voronka.id">
            <div class="flex align-items-center justify-content-between" style="background: #F0F4F9;">
              <span style="padding: 4px 4px 4px 0" class="font-bold w-full">
                {{ voronka.name }}
              </span>
              <InputSwitch
                  :model-value="voronkaToggle(voronka.id).value"
                  @update:model-value="voronkaToggle(voronka.id).value = $event"
              />
            </div>
            <span>{{ $t('stageAmo') }}:</span>
            <span v-for="status in voronka?._embedded?.statuses" :key="status.id" class="flex align-items-center justify-content-between">
              <span class="mr-2">{{ status.name }}</span>
              <InputSwitch v-model="computedStatus(voronka.id, status.id).value" />
            </span>
          </div>
        </div>
        <div class="mt-5 flex gap-4 align-items-center justify-content-end">
          <nuxt-link to="/chatbots" style="color: #334155">{{ $t('goBack') }}</nuxt-link>
          <Button :label="t('save')" @click="saveStatusMap"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.channel-wrapper {
  display: flex;
  width: 100%;
  gap: 32px;
}
@media (max-width: 601px) {
  .channel-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .voronka {
    width: 100% !important;
  }
}
.voronka {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 27%;
}
</style>
