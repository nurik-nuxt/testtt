<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useAmoCrmStore } from "~/src/shared/store/amocrm";

const channelStore = useChannelStore();
const amoCrmStore = useAmoCrmStore();

const route = useRoute();
const router = useRouter(); // Initialize useRouter
const channelStatus = ref('');
const { t } = useI18n();
const voronkas = ref([]);

const fetchChannel = async () => {
  const res = await channelStore.getChannelById(<string>route.params.id);
  channelStatus.value = res.status;
  channelTitle.value = res.title;
  console.log(res);
};

const fetchVoronki = async () => {
  const res = await amoCrmStore.fetchVoronki();
  voronkas.value = res;
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
    fetchChannel();
  }
};

const refreshCrm = () => {
  // fetchChannel();
  // fetchVoronki();
  // fetchActiveFunnels();
  router.go(0);
};

onMounted(() => {
  fetchChannel();
  fetchVoronki();
  fetchActiveFunnels();
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
      // Update the store or API as needed
    }
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
    active_statuses
  }));

  await amoCrmStore.changeActiveStatus(requestBody,<string>route.params.id)
};

const channelTitle = ref<string>('')

const changeChannel = async () => {
  await channelStore.changeStatusChannelById(<string>route.params.id, channelStatus.value, channelTitle.value).then(() => {
    fetchChannel();
  })
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="font-bold">AmoCRM</h5>
        <div class="flex w-full gap-8">
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
              <Button :label="t('save')" @click="changeChannel" :disabled="!channelTitle.length"></Button>
            </div>
          </div>
          <div class="flex flex-column gap-4">
            <h5>{{ $t('instructionsConnectAmoCRM') }}</h5>
            <span>{{ $t('instructionText') }}</span>
          </div>
        </div>
        <div class="flex flex-column mt-5 gap-3">
          <h5 class="font-bold">{{ $t('funnelInAmoCRM') }}</h5>
          <div class="flex flex-column gap-3" style="width: 27%" v-for="voronka in voronkas" :key="voronka.id">
            <span style="background: #F0F4F9; padding: 4px 4px 4px 0" class="font-bold">{{ voronka.name }}</span>
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
