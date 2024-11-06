<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useAnalyticsStore } from "~/src/shared/store/analytics";
import {queryGetModelList} from "~/src/shared/repository/dictionaries";

const channelStore = useChannelStore();
const analyticsStore = useAnalyticsStore();

const { t } = useI18n();
const channelStatus = ref('');
const funnelInAmoCRM = ref(null);

const apiKeyType = ref('own');
const model = ref('gpt-4o');
const apiKey = ref('');
const localAnalyzers = ref([])

const isSaveDisabled = computed(() => {
  return !apiKeyType.value || !model.value || !apiKey.value;
});

onMounted(async () => {
  await Promise.all([
    channelStore.getAllChannels(),
    analyticsStore.loadAnalyzers().then((res) => {
      if (res?.length) {
        localAnalyzers.value = res
      }
    }),
    analyticsStore.getGeneralSettings().then((res) => {
      if (res?.settings) {
        model.value = res?.settings?.model;
        apiKey.value = res?.settings?.apiKey?.value;
        apiKeyType.value = res?.settings?.apiKey?.type;
      }
    }),
    analyticsStore.loadResponsibleUsers()
  ])
})

const channels = computed(() => {
  return channelStore.getChannels
})

const isAmoExist = computed(() => {
  return channels.value.some((item) => item.type === 'amocrm')
})

const isBitrixExist = computed(() => {
  return channels.value.some((item) => item.type === 'bitrix')
})

const goToChannels = () => {
  return navigateTo({ name: 'channels' })
}
const channelType = ref('')
const channelTypes = ref([
  {
    title: 'amoCRM',
    value: 'amocrm'
  },
  {
    title: 'Bitrix24',
    value: 'bitrix24'
  }
])

const visibleModalScript = ref<boolean>(false);
const prompt = ref<string>('')
const addScript = async () => {
  await analyticsStore.addAnalyzer('Text', channelType.value, 'on').then(async (res) => {
    if (res?.success) {
      visibleModalScript.value = false;
      await analyticsStore.loadAnalyzers().then((res) => {
        if (res?.length) {
          localAnalyzers.value = res
        }
      });
    }
  })
}

const analyzers = computed(() => {
  return analyticsStore.getAnalyzers
})

const switcher = ref(true);

const deleteAnalyzer = async (id: string) => {
  await analyticsStore.deleteAnalyzer(id).then(async (res) => {
    if (res?.success) {
      await analyticsStore.loadAnalyzers().then((res) => {
        if (res?.length) {
          localAnalyzers.value = res
        }
      });
    }
  })
}

const saveAnalyzer = async (prompt: string, type: string, status: 'on' | 'off', id: string, responsible_users?: number[]) => {
  await analyticsStore.editAnalyzer(prompt,type,status,id, responsible_users).then(async (res) => {
    if (res?.success) {
      await analyticsStore.loadAnalyzers().then((res) => {
        if (res?.length) {
          localAnalyzers.value = res
        }
      });
    }
  })
}
const apiKeyTypes = ref([
  {
    title: t('useSeparateToken'),
    code: 'own',
    disabled: false,
  },
  {
    title: t('use7sTokens'),
    code: 'shared',
    disabled: false,
  }
]);

const { data: models, suspense: suspenseModels } = queryGetModelList();

await suspenseModels();

const saveGeneralSettings = async () => {
  await analyticsStore.editGeneralSettings(model.value,{ type: apiKeyType.value, value: apiKey.value })
}

const responsibleUsers = computed(() => {
  return analyticsStore.getResponsibleUsers;
})


const updateActiveUsers = (analyzerId: string, userId: number, isActive: boolean) => {
  const analyzerIndex = localAnalyzers.value.findIndex(a => a._id === analyzerId);
  if (analyzerIndex !== -1) {
    const userIndex = localAnalyzers.value[analyzerIndex].responsible_users.indexOf(userId);
    if (isActive && userIndex === -1) {
      localAnalyzers.value[analyzerIndex].responsible_users.push(userId);
    } else if (!isActive && userIndex !== -1) {
      localAnalyzers.value[analyzerIndex].responsible_users.splice(userIndex, 1);
    }
  }
};

const isUserActive = (analyzerId: string, userId: number) => {
  const analyzer = localAnalyzers?.value?.find(a => a._id === analyzerId);
  return analyzer ? analyzer?.responsible_users?.includes(userId) : false;
};

const getActiveResponsibleUsers = (activeUsers: number[]) => {
  return responsibleUsers.value
      .filter((user: any) => activeUsers[user.id])
      .map((user: any) => user.id);
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <div class="wrapper">
          <div>
            <h5>{{ $t('transcriptionCalls') }}</h5>
            <span>{{ $t('analyzeEmployees') }}</span>
            <div class="flex flex-column mt-5">
              <span>{{ $t('connectCRMsystem') }}</span>
              <span class="chanel-list__item align-items-center mt-2 channel-item">
            amoCRM
            <div v-if="channels.length">
              <Button v-if="!isAmoExist" :label="t('toPlug')" @click="goToChannels" />
              <span v-else style="color: #39b54a; font-size: 16px;" class="font-bold connected">Подключен</span>
            </div>
          </span>
              <span class="chanel-list__item align-items-center mt-2 channel-item">
            Bitrix24
            <div v-if="channels.length">
              <Button v-if="!isBitrixExist" :label="t('toPlug')" @click="goToChannels" />
              <span v-else style="color: #39b54a">Подключен...</span>
            </div>
          </span>
            </div>
          </div>
          <div class="flex flex-column" style="margin-top: 12px; width: 100%">
            <h5>{{ $t('connectSeparateKey') }}</h5>
            <!--Bot apiSecretKey-->
            <label for="name1" style="font-weight: 700">{{ $t('apiSecretKey') }}</label>
            <Dropdown class="mb-2" style="margin-top: 8px" id="apiKey" v-model="apiKeyType" :options="apiKeyTypes" optionLabel="title" option-value="code" :placeholder="t('chooseOption')" option-disabled="disabled"></Dropdown>
            <InputText v-if="apiKeyType === 'own'" style="margin-top: 8px; margin-bottom: 16px;" id="name1" v-model="apiKey" :placeholder="t('apiKey')" />

            <!--Bot model-->
            <label for="name1" style="font-weight: 700">{{ $t('model') }}</label>
            <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="apiKey" v-model="model" :options="models" optionLabel="name" option-value="name" :placeholder="t('chooseOption')"></Dropdown>
            <span style="color: #64748b">{{ $t('modelChoice') }}</span>
            <Button :label="t('save')" class="mt-5" @click="saveGeneralSettings" :disabled="isSaveDisabled"></Button>
          </div>
        </div>
        <Dialog v-model:visible="visibleModalScript" modal :header="t('addScript')" :style="{ width: '50rem' }">
          <div class="flex flex-column w-full mb-2">
            <h5 class="mb-0" style="font-size: 16px">Выберите тип канала</h5>
            <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="apiKey" v-model="channelType" :options="channelTypes" optionLabel="title" option-value="value" :placeholder="t('chooseOption')"></Dropdown>
          </div>
          <div class="flex w-full justify-content-end mt-4">
            <Button label="Добавить" @click="addScript" />
          </div>
        </Dialog>
        <div v-if="analyzers.length" class="flex flex-column gap-6 mt-8">
          <div v-for="(analyzer, index) in localAnalyzers" :key="analyzer._id" class="flex flex-column gap-3 analyzer-box">
            <div class="flex gap-5 analyzer-mobile">
              <div class="flex flex-column channel-mobile">
                <div class="flex align-items-center gap-3 mb-4">
                  <Badge :value="index + 1" size="large" style="background-color: #F9753E; border: none;"></Badge>
                  <h5 class="m-0">{{ analyzer.type === 'amocrm' ? 'amoCRM' : 'Bitrix24' }}</h5>
                </div>
                <Button :label="t('updateDataCRM')"/>
                <span class="mt-4 mb-2 font-bold text-xl">{{ $t('selectEmployees') }}</span>
                <div class="flex flex-column gap-3">
                  <div class="flex justify-content-between align-items-center" v-for="user in responsibleUsers" :key="user.id">
                    <div>{{ user?.name }}</div>
                    <InputSwitch :model-value="isUserActive(analyzer._id, user.id)" @update:model-value="newValue => updateActiveUsers(analyzer._id, user.id, newValue)" />
                  </div>
                </div>
              </div>
              <div class="flex flex-column gap-2 prompt-mobile">
                <div class="flex align-items-center justify-content-between">
                  <h5 class="mb-0" style="font-size: 16px">{{ $t('conversationAnalysis') }}</h5>
                  <a target="_blank" href="https://docs.google.com/spreadsheets/d/1d9bDF0LtqPgvE01qGO9jroUbrwda-HGd2QKBNsj1smM/edit?usp=sharing" style="color: #076AE1;">({{ $t('templates') }})</a>
                </div>
                <Textarea v-model="analyzer.prompt" type="text" id="script" class="w-full" :autoResize="true" :placeholder="t('writeScript')" rows="20" cols="2" />
              </div>
            </div>
            <div class="flex align-items-center gap-4 justify-content-end">
              <i style="cursor: pointer; color: #EE9186; font-size: 18px; margin-left: auto;" class="pi pi-trash" @click="deleteAnalyzer(analyzer._id)"/>
              <Button :label="t('save')" @click="saveAnalyzer(analyzer.prompt, analyzer.type, 'on', analyzer._id, localAnalyzers?.find((item) => item?._id === analyzer._id)?.responsible_users)"/>
            </div>
          </div>
        </div>
        <Button :label="t('addScript')"  style="background-color: #F9753E; border: none" class="mt-4 mb-4 add-btn" @click="visibleModalScript = true" :disabled="!(isAmoExist || isBitrixExist) || isSaveDisabled"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.channel-item {
  width: 100% !important;
}

.add-btn {
  width: 100% ;
  @media (min-width: 601px) {
    width: 30% !important;
  }
}
.prompt-mobile {
  width: 100% ;
  @media (min-width: 601px) {
    width: 80% !important;
  }
}
.channel-mobile {
  width: 100% ;
  @media (min-width: 601px) {
    width: 40% !important;
  }
}

.analyzer-box {
  border: 1px solid #0f172a;
  border-radius: 6px;
  padding: 16px;
}

.analyzer-mobile {
  @media (max-width: 601px) {
    flex-direction: column;
  }
}
.connected {
  margin-right: 14px;
}
.wrapper {
  display: flex;
  gap: 12px;
  align-items: baseline;
  @media (max-width: 601px) {
    flex-direction: column;
  }
}
</style>