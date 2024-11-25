<script setup lang="ts">

// Импортируйте необходимые компоненты PrimeVue
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Badge from 'primevue/badge';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';

// Импортируйте ваши сторы и другие зависимости
import { useBotStore } from '~/src/shared/store/bot';
import { useAmoCrmStore } from '~/src/shared/store/amocrm';
import { useBitrix24 } from '~/src/shared/store/bitrix24';
import { useUploadFileStore } from '~/src/shared/store/upload';
import { BaseFile } from '~/src/shared/components/base';

// Определите props
const props = defineProps({
  currentBot: {
    type: Object,
    required: true,
  },
  botFunctions: {
    type: Array,
    required: true,
  },
});

// Определите emits
const emit = defineEmits(['update:currentBot', 'addTask']);

// Локальные переменные и методы
const { t } = useI18n();
const route = useRoute();
const amoCrmStore = useAmoCrmStore();
const bitrix24Store = useBitrix24();
const uploadFileStore = useUploadFileStore();

const showFunctionDeleteModal = ref<boolean>(false);
const showFileDeleteModal = ref<boolean>(false);
const selectedBotTaskIndex = ref<number | null>(null);

const parameterTypes = ref<{ title: string; value: 'string' | 'number' }[]>([
  {
    title: 'Строка',
    value: 'string',
  },
  {
    title: 'Число',
    value: 'number',
  },
]);

const customApiMethods = ref<{ title: string; value: string }[]>([
  {
    title: 'GET',
    value: 'GET'
  },
  {
    title: 'POST',
    value: 'POST'
  }
]);

const parameterActions = ref([
  {
    title: 'Текст',
    value: 'text'
  },
  {
    title: 'Параметр из функции',
    value: 'parameterFunction'
  },
  {
    title: 'Данные пользователя',
    value: 'userData'
  }
]);

const funnels = computed(() => {
  if (props.currentBot?.channels?.some((channel) => channel?.type === 'bitrix24')) {
    return Array.isArray(bitrix24Store.getFunnels) ? bitrix24Store.getFunnels : [];
  } else if (props.currentBot?.channels?.some((channel) => channel?.type === 'amocrm')) {
    return Array.isArray(amoCrmStore.getAllFunnels) ? amoCrmStore.getAllFunnels : [];
  } else {
    return [];
  }
});

const fields = computed(() => {
  if (props.currentBot?.channels?.some((channel) => channel.type === 'bitrix24')) {
    return Array.isArray(bitrix24Store.getFields) ? bitrix24Store.getFields : [];
  } else {
    return Array.isArray(amoCrmStore.getFields) ? amoCrmStore.getFields : [];
  }
});

// Методы для управления задачами
const addTask = () => {
  emit('addTask');
};

const deleteFunction = () => {
  if (selectedBotTaskIndex.value !== null) {
    props.botFunctions.splice(selectedBotTaskIndex.value, 1);
    showFunctionDeleteModal.value = false;
    selectedBotTaskIndex.value = null;
  }
};

const showDeleteConfirmModal = (index: number) => {
  showFunctionDeleteModal.value = true;
  selectedBotTaskIndex.value = index;
};

// Методы для InputSwitch
const getInterruptDialogue = (functionIndex: number) => {
  return computed({
    get() {
      const action = props.botFunctions[functionIndex]?.actions?.find(
          (action: any) => action.name === 'stop_dialogue'
      );
      return !!action;
    },
    set(value) {
      if (value) {
        const exists = props.botFunctions[functionIndex]?.actions?.some(
            (action: any) => action.name === 'stop_dialogue'
        );
        if (!exists) {
          props.botFunctions[functionIndex]?.actions.push({ name: 'stop_dialogue' });
        }
      } else {
        props.botFunctions[functionIndex].actions = props.botFunctions[functionIndex].actions.filter(
            (action: any) => action.name !== 'stop_dialogue'
        );
      }
    },
  });
};

const getStopReminder = (functionIndex: number) => {
  return computed({
    get() {
      const action = props.botFunctions[functionIndex]?.actions?.find(
          (action: any) => action.name === 'stop_reminder'
      );
      return !!action;
    },
    set(value) {
      if (value) {
        const exists = props.botFunctions[functionIndex]?.actions?.some(
            (action: any) => action.name === 'stop_reminder'
        );
        if (!exists) {
          props.botFunctions[functionIndex]?.actions.push({ name: 'stop_reminder' });
        }
      } else {
        props.botFunctions[functionIndex].actions = props.botFunctions[functionIndex].actions.filter(
            (action: any) => action.name !== 'stop_reminder'
        );
      }
    },
  });
};

// Методы для управления параметрами задачи
const deleteBotParameter = (indexBotFunction: number, indexParameter: number) => {
  props.botFunctions[indexBotFunction].parameters.splice(indexParameter, 1);
};

const addParameter = (indexBotFunction: number) => {
  props.botFunctions[indexBotFunction].parameters.push({
    name: '',
    type: 'string',
    description: '',
  });
};

// Методы для управления файлами
const openFileUploader = (functionIndex: number) => {
  const fileInput = document.getElementById(`file-upload-${functionIndex}`);
  if (fileInput) {
    fileInput.click();
  }
};

const addFile = async (event: Event, functionIndex: number) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;
  if (!file) return;
  await uploadFileStore.loadFile(file).then((res) => {
    props.botFunctions[functionIndex]?.actions?.push({
      name: 'send_file',
      parameters: {
        fileName: res?.filename,
        type: res?.mimeType?.includes('image') ? 'picture' : res?.mimeType?.includes('pdf') ? 'pdf' : res?.mimeType?.includes('spreadsheetml')  ? 'excel' : res?.mimeType?.includes('wordprocessingml') ? 'docs' : 'file'
      }
    });
  });
};

const deleteFunctionSendFile = (file: any, functionIndex: number, fileIndex: number) => {
  const action = props.botFunctions[functionIndex]?.actions;
  for (let i = 0; i < action.length; i++) {
    if (action[i]?.name === 'send_file') {
      action.splice(i, 1);
      break;
    }
  }
  showFileDeleteModal.value = false;
};

// Методы для получения и установки значений в actions
// ... предыдущие методы ...

// Методы для CUSTOM API
const getCustomApiMethod = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(action => action?.name === 'custom_api');
      if (action && action.parameters) {
        return action.parameters.method || '';
      }
      return '';
    },
    set(value) {
      let action = props.botFunctions[index]?.actions?.find(action => action?.name === 'custom_api');
      if (!action) {
        action = { name: 'custom_api', parameters: { method: '', url: '', params: [], headers: [], body: [] } };
        props.botFunctions[index]?.actions.push(action);
      }
      action.parameters.method = value;
    }
  });
};

const getCustomApiUrl = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(action => action?.name === 'custom_api');
      if (action && action.parameters) {
        return action.parameters.url || '';
      }
      return '';
    },
    set(value) {
      let action = props.botFunctions[index]?.actions?.find(action => action?.name === 'custom_api');
      if (!action) {
        action = { name: 'custom_api', parameters: { method: '', url: '', params: [], headers: [], body: [] } };
        props.botFunctions[index]?.actions.push(action);
      }
      action.parameters.url = value;
    }
  });
};

const getCustomApiParams = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(action => action?.name === 'custom_api');
      if (action && action.parameters) {
        return action.parameters.params || [];
      }
      return [];
    },
    set(value) {
      let action = props.botFunctions[index]?.actions?.find(action => action?.name === 'custom_api');
      if (!action) {
        action = { name: 'custom_api', parameters: { method: '', url: '', params: [], headers: [], body: [] } };
        props.botFunctions[index]?.actions.push(action);
      }
      action.parameters.params = value;
    }
  });
};

const getCustomApiHeaders = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(action => action?.name === 'custom_api');
      if (action && action.parameters) {
        return action.parameters.headers || [];
      }
      return [];
    },
    set(value) {
      let action = props.botFunctions[index]?.actions?.find(action => action?.name === 'custom_api');
      if (!action) {
        action = { name: 'custom_api', parameters: { method: '', url: '', params: [], headers: [], body: [] } };
        props.botFunctions[index]?.actions.push(action);
      }
      action.parameters.headers = value;
    }
  });
};

const getCustomApiBody = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(action => action?.name === 'custom_api');
      if (action && action.parameters) {
        return action.parameters.body || [];
      }
      return [];
    },
    set(value) {
      let action = props.botFunctions[index]?.actions?.find(action => action?.name === 'custom_api');
      if (!action) {
        action = { name: 'custom_api', parameters: { method: '', url: '', params: [], headers: [], body: [] } };
        props.botFunctions[index]?.actions.push(action);
      }
      action.parameters.body = value;
    }
  });
};

const addCustomApiParameter = (functionIndex: number, paramType: 'params' | 'headers' | 'body') => {
  let action = props.botFunctions[functionIndex]?.actions?.find(action => action?.name === 'custom_api');
  if (!action) {
    action = { name: 'custom_api', parameters: { method: '', url: '', params: [], headers: [], body: [] } };
    props.botFunctions[functionIndex]?.actions.push(action);
  }
  action.parameters[paramType].push({ title: '', action: '', value: '' });
};

const deleteCustomApiParameter = (functionIndex: number, paramIndex: number, paramType: 'params' | 'headers' | 'body') => {
  const action = props.botFunctions[functionIndex]?.actions?.find(action => action?.name === 'custom_api');
  if (action && action.parameters) {
    action.parameters[paramType].splice(paramIndex, 1);
  }
};
</script>

<template>
  <div class="card-form p-fluid" style="margin-top: 16px">
    <!-- Bot instructions -->
    <div class="field">
      <div class="flex justify-content-between align-items-end">
        <div class="flex flex-column">
          <label style="font-weight: 700">{{ t('botInstructionPrompt') }}</label>
          <span class="mb-2 mt-2">{{ t('promptUsageTip') }}</span>
        </div>
        <span style="color: #076AE1; margin-bottom: 7px">{{ t('variables') }}</span>
      </div>
      <Textarea :placeholder="t('youBotConsultant')" :autoResize="false" rows="25" cols="2" v-model="currentBot.instructions"/>
    </div>

    <!-- Bot helloOnFirst -->
    <span class="bot-card__activate">
      {{ t('welcomeMessageStart') }}
      <InputSwitch v-model="currentBot.hello_on_first" style="margin-left: 8px"/>
    </span>

    <!-- Bot helloMessage -->
    <div v-if="currentBot.hello_on_first" class="card-form p-fluid">
      <div class="field" style="margin-top: 12px">
        <Textarea :placeholder="t('autoMessageNote')" :autoResize="true" rows="3" cols="30" v-model="currentBot.helloMessage" />
      </div>
    </div>

    <!-- Bot Tasks -->
    <div v-if="botFunctions" class="mt-5 flex flex-column gap-4">
      <!-- <pre>{{ botFunctions }}</pre> -->
      <div v-for="(botFunction, index) in botFunctions" :key="index" class="task-wrapper">
        <!-- <pre>{{ botFunction }}</pre> -->
        <div class="mt-3 mb-4 flex flex-column gap-3">
          <div class="flex flex-column gap-2" style="padding: 0 16px">
            <div class="flex justify-content-between w-full align-items-center mb-4">
              <div class="flex gap-3 align-items-center">
                <Badge :value="index + 1" size="large" style="background-color: #F9753E; border: none;"></Badge>
                <label style="font-weight: 700">{{ t('botTask') }}</label>
              </div>
              <i class="pi pi-trash ml-auto" style="cursor: pointer; color: #EE9186; font-size: 18px" @click="showDeleteConfirmModal(index)"></i>

              <Dialog v-model:visible="showFunctionDeleteModal" :header="t('deleteBotTask')">
                <span class="text-surface-500 dark:text-surface-400 block mb-4">{{ t('confirmDeleteBotTask') }}</span>
                <div class="flex justify-content-center gap-2 w-full">
                  <Button type="button" :label="t('delete')" severity="danger" @click="deleteFunction"></Button>
                  <Button type="button" :label="t('cancel')" @click="showFunctionDeleteModal = false"></Button>
                </div>
              </Dialog>
            </div>
            <Textarea rows="2" cols="30" v-model="botFunction.prompt" />
          </div>
          <span style="font-weight: 700; padding: 0 16px">{{ t('actionsAfterTask') }}</span>
          <div class="flex align-items-center gap-4" style="padding: 0 16px">
            <span class="bot-card__activate">
              {{ t('endDialogue') }}
              <InputSwitch v-model="getInterruptDialogue(index).value" style="margin-left: 24px"/>
            </span>
            <span class="bot-card__activate">
              {{ t('isReminderStop') }}
              <InputSwitch v-model="getStopReminder(index).value" style="margin-left: 24px"/>
            </span>
          </div>
          <div style="margin: 0 8px">
            <div class="flex flex-column gap-3" style="padding: 16px; background: #FFEFE5; border-radius: 6px">
              <span style="font-weight: 700">{{ t('taskParameters') }}</span>
              <div v-for="(parameter, parameterIndex) in botFunction?.parameters" :key="parameterIndex" class="flex gap-3 align-items-baseline">
                <InputText id="parameterName" type="text" v-model="parameter.name" placeholder="Имя параметра"/>
                <Dropdown id="parameterType" v-model="parameter.type" :options="parameterTypes" optionLabel="title" option-value="value" :placeholder="t('chooseOption')"></Dropdown>
                <Textarea placeholder="Описание параметра" :autoResize="true" rows="3" cols="2" v-model="parameter.description" />
                <i class="pi pi-trash ml-auto" style="cursor: pointer; color: #EE9186; font-size: 18px" @click="deleteBotParameter(index, parameterIndex)"></i>
              </div>
              <Button label="+" style="background-color: #71BA76; width:50px; border: none" class="add-btn" @click="addParameter(index)"/>
            </div>
          </div>
          <div class="task-panel">
            <TabView :scrollable="true">
              <!-- Send FileInMessage -->
              <!-- ... предыдущие вкладки ... -->

              <!-- CUSTOM API Tab -->
              <TabPanel>
                <template #header>
                  <span class="white-space-nowrap" :class="{'success-tab-title': botFunction?.actions?.some((item) => item?.name === 'custom_api' && item?.parameters?.url)}">CUSTOM API</span>
                </template>
                <div class="mx-2">
                  <div class="flex flex-column mt-3 mb-3 px-2 py-2" style="background: #FFEFE5; border-radius: 6px">
                    <label for="customApi" style="font-weight: 700; margin-bottom: 12px;">CUSTOM API</label>
                    <div class="flex flex-column gap-2">
                      <span>{{ t('restApiSettings') }}</span>
                      <div class="flex gap-2 align-items-center">
                        <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="customApiMethod" v-model="getCustomApiMethod(index).value" :options="customApiMethods" optionLabel="title" option-value="value" :placeholder="t('requestMethod')"></Dropdown>
                        <InputText id="customApiUrl" type="text" v-model="getCustomApiUrl(index).value" :placeholder="t('requestUrl')" />
                      </div>
                    </div>
                    <div class="mt-3">
                      <span class="mb-2">{{ t('apiParams') }} (params):</span>
                      <div v-for="(parameter, paramIndex) in getCustomApiParams(index).value" :key="paramIndex" class="flex align-items-center gap-2 mt-2">
                        <InputText id="parameterTitle" type="text" v-model="parameter.title" :placeholder="t('variableName')" />
                        <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="parameterAction" v-model="parameter.action" :options="parameterActions" optionLabel="title" option-value="value" :placeholder="t('action')"></Dropdown>
                        <template v-if="parameter.action === 'text'">
                          <InputText :placeholder="t('valueToPass')" id="parameterActionText" v-model="parameter.value"></InputText>
                        </template>
                        <template v-else>
                          <!-- Дополнительная логика для других типов параметров -->
                        </template>
                        <i class="pi pi-trash ml-auto" style="cursor: pointer; color: #EE9186; font-size: 18px" @click="deleteCustomApiParameter(index, paramIndex, 'params')"></i>
                      </div>
                      <!--                      <Button class="mt-3 text-center" @click="addCustomApiParameter(index, 'params')">+ {{ t('newParameter') }}</Button>-->
                      <Button class="mt-3 text-center" @click="addCustomApiParameter(index, 'params')" :label="`+ ${ t('newParameter') }`"></Button>
                    </div>
                    <div class="mt-3">
                      <span class="mb-2">{{ t('apiHeaders') }} (headers):</span>
                      <div v-for="(header, headerIndex) in getCustomApiHeaders(index).value" :key="headerIndex" class="flex align-items-center gap-2 mt-2">
                        <InputText id="headerTitle" type="text" v-model="header.title" :placeholder="t('name')" />
                        <InputText id="headerValue" type="text" v-model="header.value" :placeholder="t('value')" />
                        <i class="pi pi-trash ml-auto" style="cursor: pointer; color: #EE9186; font-size: 18px" @click="deleteCustomApiParameter(index, headerIndex, 'headers')"></i>
                      </div>
                      <Button class="mt-3 text-center" @click="addCustomApiParameter(index, 'headers')" :label="`+ ${t('newParameter')}`"></Button>
                    </div>
                    <div class="mt-3">
                      <span class="mb-2">{{ t('apiBody') }} (body):</span>
                      <div v-for="(bodyParam, bodyIndex) in getCustomApiBody(index).value" :key="bodyIndex" class="flex align-items-center gap-2 mt-2">
                        <InputText id="parameterTitle" type="text" v-model="bodyParam.title" :placeholder="t('variableName')" />
                        <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="parameterAction" v-model="bodyParam.action" :options="parameterActions" optionLabel="title" option-value="value" :placeholder="t('action')"></Dropdown>
                        <template v-if="bodyParam.action === 'text'">
                          <InputText :placeholder="t('valueToPass')" id="parameterActionText" v-model="bodyParam.value"></InputText>
                        </template>
                        <template v-else>
                          <!-- Дополнительная логика для других типов параметров -->
                        </template>
                        <i class="pi pi-trash ml-auto" style="cursor: pointer; color: #EE9186; font-size: 18px" @click="deleteCustomApiParameter(index, bodyIndex, 'body')"></i>
                      </div>
                      <Button class="mt-3 text-center" @click="addCustomApiParameter(index, 'body')" :label="`+ ${t('newParameter')}`"></Button>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
      <Button :label="t('addTask')" style="background-color: #F9753E; border: none" class="add-btn" @click="addTask"/>
    </div>
  </div>
</template>

<style scoped>
.bot-card__activate {
  display: flex;
  align-items: center;
  gap: 8px;
}
.task-wrapper {
  border: 1px solid #0f172a;
  border-radius: 6px;
  padding: 8px 0;
}
.task-panel {
  padding: 0 16px;
}
.add-btn {
  width: 25%;
}
.success-tab-title {
  color: #11B981;
}
.files {
  display: grid;
  grid-template-columns: repeat(5, minmax(0,150px));
  gap: 16px;
}
@media (max-width: 601px) {
  .add-btn {
    width: 100% !important;
  }
  .manage-files {
    flex-direction: column;
    align-items: flex-start !important;
  }
}
.file-btn {
  width: 25%;
  @media (max-width: 1530px) {
    width: 30% !important;
  }

}

</style>
