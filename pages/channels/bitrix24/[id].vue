<script setup lang="ts">
import { useBitrix24 } from "~/src/shared/store/bitrix24";
import { useChannelStore } from "~/src/shared/store/channel";

interface Funnel {
  ID: string;
  CREATED_DATE: string;
  NAME: string;
  SORT: string;
  IS_LOCKED: string;
  statuses?: Funnel[]
}

interface FunnelStatus {
  STATUS_ID: string;
  NAME: string;
  SORT: number;
}

const birtix24Store = useBitrix24();
const channelStore = useChannelStore();

const route = useRoute();
const { t } = useI18n();

const funnels = ref<Funnel[]>([])
const statuses = ref<FunnelStatus[]>([])
const fetchFunnels = async () => {
  funnels.value = await birtix24Store.loadFunnels(<string>route?.params?.id)
};

const fetchActiveFunnels = async () => {
  await birtix24Store.fetchActiveFunnels(<string>route.params.id);
};

const activeFunnels = computed(() => {
  return birtix24Store.getActiveFunnels;
});
const fetchStatuses = async () => {
  statuses.value = await birtix24Store.loadStatuses(<string>route?.params?.id)
};

const fetchChannel = async () => {
  const res = await channelStore.getChannelById(<string>route.params.id);
  channelStatus.value = res.status;
  channelTitle.value = res.title;
};

const router = useRouter();
const channelStatus = ref('');
const channelTitle = ref<string>('');

const changeChannelStatus = async (status: string) => {
  const res = await channelStore.changeStatusChannelById(<string>route.params.id, status);
  if (res.success) {
    await fetchChannel();
  }
};

const refreshCrm = () => {
  router.go(0);
};

const changeChannel = async () => {
  await channelStore.changeStatusChannelById(<string>route.params.id, channelStatus.value, channelTitle.value).then(() => {
    fetchChannel();
  })
}
onMounted(() => {
  Promise.all([
    fetchFunnels(),
    fetchChannel(),
    fetchActiveFunnels()
  ])
});

const getStatusKey = (idFunnel: string, idStatus: string) => {
  return `${idFunnel}-${idStatus}`;
};

const isActiveStatus = (idFunnel: string, idStatus: string) => {
  return activeFunnels.value?.find((funnel: { pipeline_id: string }) => funnel.pipeline_id === idFunnel)?.active_statuses?.includes(idStatus);
};
const statusMap = ref(new Map());

const initializeStatusMap = () => {
  funnels.value.forEach((funnel) => {
    funnel?.statuses?.forEach((status) => {
      console.log(status);
      const key = getStatusKey(funnel?.ID, status?.STATUS_ID);
      statusMap.value.set(key, isActiveStatus(funnel?.ID, status?.STATUS_ID));
    });
  });
};

watch(funnels, initializeStatusMap);

const computedStatus = (idFunnel: string, idStatus: string) => {
  const key = getStatusKey(idFunnel, idStatus);
  return computed({
    get() {
      return statusMap.value.get(key) || false;
    },
    set(value) {
      statusMap.value.set(key, value);
    }
  });
};

const saveStatusMap = async () => {
  const pipelineStatusMap = new Map();

  statusMap.value.forEach((value, key) => {
    const [pipelineId, statusId] = key.split('-').map(String);
    console.log(statusId);
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

  await birtix24Store.changeActiveStatus(requestBody,<string>route.params.id)
};

</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="font-bold">Bitrix24</h5>
        <div class="channel-wrapper">
          <div class="flex flex-column gap-4">
            <Button v-if="channelStatus === 'active'" label="Отключить Bitrix24" severity="danger" @click="changeChannelStatus('off')" />
            <Button v-else label="Подключить Bitrix24" @click="changeChannelStatus('active')" />
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
          <div class="flex flex-column gap-4">
            <h5>Инструкция Как подключить Bitrix24</h5>
            <span>{{ $t('instructionText') }}</span>
          </div>
        </div>
        <div class="flex flex-column mt-5 gap-3">
<!--          <h5 class="font-bold">Воронки в Bitrix24</h5>-->
          <div class="voronka" v-for="voronka in funnels" :key="voronka.ID">
            <span style="background: #F0F4F9; padding: 4px 4px 4px 0" class="font-bold">{{ voronka.NAME }}</span>
            <span>{{ $t('stageAmo') }}:</span>
            <span v-for="status in voronka?.statuses" :key="status.STATUS_ID" class="flex align-items-center justify-content-between">
              <span class="mr-2">{{ status.NAME }}</span>
              <InputSwitch v-model="computedStatus(voronka.ID, status.STATUS_ID).value" />
            </span>
          </div>
        </div>
        <div class="mt-5 flex gap-4 align-items-center justify-content-end">
          <nuxt-link to="/chatbots" style="color: #334155">{{ $t('goBack') }}</nuxt-link>
          <Button :label="t('save')" @click="saveStatusMap" />
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
@media (max-width: 601px){
  .channel-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px
  }
  .voronka {
    width: 100% !important;
  }
}
.voronka {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 27%
}
</style>