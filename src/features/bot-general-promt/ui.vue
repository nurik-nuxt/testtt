<script setup lang="ts">
import { queryGetUserDataFields } from "~/src/shared/repository/dictionaries";

const { data: userDataFields, suspense: suspenseFields } = queryGetUserDataFields();

suspenseFields();
// Import PrimeVue components
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Badge from 'primevue/badge';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';

// Import your stores and other dependencies
import { useAmoCrmStore } from '~/src/shared/store/amocrm';
import { useBitrix24 } from '~/src/shared/store/bitrix24';
import { useUploadFileStore } from '~/src/shared/store/upload';
import BaseFile from '~/src/shared/components/base/BaseFile.vue';

// Define props
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

// Define emits
const emit = defineEmits(['update:currentBot', 'addTask']);

// Local variables and methods
const { t } = useI18n();
const route = useRoute();
const amoCrmStore = useAmoCrmStore();
const bitrix24Store = useBitrix24();
const uploadFileStore = useUploadFileStore();

const showFunctionDeleteModal = ref<boolean>(false);
const showFileDeleteModal = ref<boolean>(false);
const selectedBotTaskIndex = ref<number | null>(null);

// Define parameter types
const parameterTypes = ref<{ title: string; value: 'string' | 'number' }[]>([
  { title: t('line'), value: 'string' },
  { title: t('number'), value: 'number' },
]);

// Define custom API methods
const customApiMethods = ref<{ title: string; value: string }[]>([
  { title: 'GET', value: 'get' },
  { title: 'POST', value: 'post' },
]);

// Define parameter actions
const parameterActions = ref([
  { title: t('text'), value: 'static' },
  { title: t('functionParams'), value: 'function_parameter' },
  { title: t('userData'), value: 'user_data' },
]);

// Computed property for funnels
const funnels = computed(() => {
  if (props.currentBot?.channels?.some((channel) => channel?.type === 'bitrix24')) {
    return Array.isArray(bitrix24Store.getFunnels) ? bitrix24Store.getFunnels : [];
  } else if (props.currentBot?.channels?.some((channel) => channel?.type === 'amocrm')) {
    return Array.isArray(amoCrmStore.getAllFunnels) ? amoCrmStore.getAllFunnels : [];
  } else {
    return [];
  }
});

// Computed property for fields
const fields = computed(() => {
  if (props.currentBot?.channels?.some((channel) => channel.type === 'bitrix24')) {
    return Array.isArray(bitrix24Store.getFields) ? bitrix24Store.getFields : [];
  } else {
    return Array.isArray(amoCrmStore.getFields) ? amoCrmStore.getFields : [];
  }
});

// Methods for managing tasks
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

// Methods for InputSwitch
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
          // Ensure actions array exists
          if (!props.botFunctions[functionIndex].actions) {
            props.botFunctions[functionIndex].actions = [];
          }
          props.botFunctions[functionIndex].actions.push({ name: 'stop_dialogue' });
        }
      } else {
        if (props.botFunctions[functionIndex].actions) {
          props.botFunctions[functionIndex].actions = props.botFunctions[functionIndex].actions.filter(
              (action: any) => action.name !== 'stop_dialogue'
          );
        }
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
          // Ensure actions array exists
          if (!props.botFunctions[functionIndex].actions) {
            props.botFunctions[functionIndex].actions = [];
          }
          props.botFunctions[functionIndex].actions.push({ name: 'stop_reminder' });
        }
      } else {
        if (props.botFunctions[functionIndex].actions) {
          props.botFunctions[functionIndex].actions = props.botFunctions[functionIndex].actions.filter(
              (action: any) => action.name !== 'stop_reminder'
          );
        }
      }
    },
  });
};

// Computed property to get and set pipeline_id
const getFunnelId = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'move_in_pipeline'
      );
      return action?.parameters?.pipeline_id || '';
    },
    set(value: string) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'move_in_pipeline'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = {
          name: 'move_in_pipeline',
          parameters: { pipeline_id: value, status_id: '' },
        };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.pipeline_id = value;
      }
    },
  });
};

// Computed property to get and set status_id
const getStatusId = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'move_in_pipeline'
      );
      return action?.parameters?.status_id || '';
    },
    set(value: string) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'move_in_pipeline'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = {
          name: 'move_in_pipeline',
          parameters: { pipeline_id: '', status_id: value },
        };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.status_id = value;
      }
    },
  });
};

// Computed property to get and set deal note text
const getDealNoteText = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'add_note'
      );
      return action?.parameters?.text || '';
    },
    set(value: string) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'add_note'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = { name: 'add_note', parameters: { text: value } };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.text = value;
      }
    },
  });
};

function getCodeByFieldId(list, fieldId) {
  for (const group of list) {
    const items = group?.items || [];
    const field = items.find(item => item.id === fieldId);
    if (field) {
      return field?.code || null; // Return the code or null if not available
    }
  }
  return null; // Return null if the fieldId is not found
}

const getFieldId = (functionIndex, customFieldIndex) => {
  return computed({
    get() {
      const action = props.botFunctions[functionIndex]?.actions?.find(
          (action) => action.name === 'edit_crm_fields'
      );
      if (
          action?.parameters?.fields &&
          action.parameters.fields.length > customFieldIndex
      ) {
        return action.parameters.fields[customFieldIndex].field || '';
      }
      return '';
    },
    set(value) {
      console.log(value, 'value');
      // Убедитесь, что actions существует
      if (!props.botFunctions[functionIndex].actions) {
        props.botFunctions[functionIndex].actions = [];
      }

      let action = props.botFunctions[functionIndex].actions.find(
          (action) => action.name === 'edit_crm_fields'
      );

      if (!action) {
        // Создайте действие, если оно не существует
        action = {
          name: 'edit_crm_fields',
          parameters: {
            fields: []
          },
        };
        props.botFunctions[functionIndex].actions.push(action);
      }

      // Убедитесь, что custom_fields_values существует
      if (!action.parameters.fields) {
        action.parameters.fields = [];
      }
      if (value?.category === 'contact_fields') {
        if (value?.type === 'custom_fields') {
          action.parameters.fields[customFieldIndex].field = value
          action.parameters.fields[customFieldIndex].field_id = value.id
          action.parameters.fields[customFieldIndex].code = value.code
          action.parameters.fields[customFieldIndex].category = 'contact_fields'
          action.parameters.fields[customFieldIndex].type = 'custom_fields'
        }
        if (value.type === 'standard_fields') {
          action.parameters.fields[customFieldIndex].field_id = ''
          action.parameters.fields[customFieldIndex].code = ''
          action.parameters.fields[customFieldIndex].field = value
          action.parameters.fields[customFieldIndex].category = 'contact_fields'
          action.parameters.fields[customFieldIndex].type = 'standard_fields'
        }
      }

      if (value.category === 'lead_fields') {
        if (value.type === 'custom_fields') {
          action.parameters.fields[customFieldIndex].field = value
          action.parameters.fields[customFieldIndex].field_id = value.id
          action.parameters.fields[customFieldIndex].code = value.code
          action.parameters.fields[customFieldIndex].category = 'lead_fields'
          action.parameters.fields[customFieldIndex].type = 'custom_fields'
        }
        if (value.type === 'standard_fields') {
          action.parameters.fields[customFieldIndex].field_id = ''
          action.parameters.fields[customFieldIndex].code = ''
          action.parameters.fields[customFieldIndex].field = value
          action.parameters.fields[customFieldIndex].category = 'lead_fields'
          action.parameters.fields[customFieldIndex].type = 'standard_fields'
        }
      }
    },
  });
};

const getFieldType = (functionIndex, standardFieldIndex) => {
  return computed({
    get() {
      const action = props.botFunctions[functionIndex]?.actions?.find(
          (action) => action.name === 'edit_crm_fields'
      );
      if (
          action?.parameters?.fields &&
          action.parameters.fields.length > standardFieldIndex
      ) {
        return action.parameters.fields[standardFieldIndex].kind || '';
      }
      return '';
    },
    set(value) {
      if (!props.botFunctions[functionIndex].actions) {
        props.botFunctions[functionIndex].actions = [];
      }

      let action = props.botFunctions[functionIndex].actions.find(
          (action) => action.name === 'edit_crm_fields'
      );

      if (!action) {
        action = {
          name: 'edit_crm_fields',
          parameters: {
            fields: []
          },
        };
        props.botFunctions[functionIndex].actions.push(action);
      }

      action.parameters.fields[standardFieldIndex].kind = value
    },
  });
};

const getFieldValue = (functionIndex, customFieldIndex) => {
  return computed({
    get() {
      const action = props.botFunctions[functionIndex]?.actions?.find(
          (action) => action.name === 'edit_crm_fields'
      );
      if (
          action?.parameters?.fields &&
          action.parameters.fields.length > customFieldIndex
      ) {
        return action.parameters.fields[customFieldIndex].field_values || '';
      }
      return '';
    },
    set(value) {
      if (!props.botFunctions[functionIndex].actions) {
        props.botFunctions[functionIndex].actions = [];
      }

      let action = props.botFunctions[functionIndex].actions.find(
          (action) => action.name === 'edit_crm_fields'
      );

      if (!action) {
        action = {
          name: 'edit_crm_fields',
          parameters: {
            fields: []
          },
        };
        props.botFunctions[functionIndex].actions.push(action);
      }

      if (!action.parameters.fields) {
        action.parameters.fields = [];
      }

      action.parameters.fields[customFieldIndex].field_values = value

      console.log(value, 'value');
    },
  });
};

const addCustomFieldsValues = (functionIndex) => {
  // Убедитесь, что actions существует
  if (!props.botFunctions[functionIndex].actions) {
    props.botFunctions[functionIndex].actions = [];
  }

  let action = props.botFunctions[functionIndex].actions.find(
      (action) => action.name === 'edit_crm_fields'
  );

  if (!action) {
    // Создайте действие, если оно не существует
    action = {
      name: 'edit_crm_fields',
      parameters: {
        fields: []
      },
    };
    props.botFunctions[functionIndex].actions.push(action);
  }

  // Добавьте новое поле
  action.parameters.fields.push({
    field_id: '',
    kind: '',
    field_values: '',
    category: '',
    type: '',
    field: '',
  });
};

const deleteCustomFieldValue = (functionIndex, customFieldIndex) => {
  let action = props.botFunctions[functionIndex].actions.find(
      (action) => action.name === 'edit_crm_fields'
  );

  if (action && action.parameters && action.parameters.fields) {
    action.parameters.fields.splice(customFieldIndex, 1);
  }
};


// Methods for managing task parameters
const deleteBotParameter = (indexBotFunction: number, indexParameter: number) => {
  if (props.botFunctions[indexBotFunction].parameters) {
    props.botFunctions[indexBotFunction].parameters.splice(indexParameter, 1);
  }
};

const addParameter = (indexBotFunction: number) => {
  if (!props.botFunctions[indexBotFunction].parameters) {
    props.botFunctions[indexBotFunction].parameters = [];
  }
  props.botFunctions[indexBotFunction].parameters.push({
    name: '',
    type: 'string',
    description: '',
  });
};

// Methods for managing files
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
  try {
    const res = await uploadFileStore.loadFile(file);
    if (res?.filename && res?.mimeType) {
      // Ensure actions array exists
      if (!props.botFunctions[functionIndex].actions) {
        props.botFunctions[functionIndex].actions = [];
      }
      props.botFunctions[functionIndex].actions.push({
        name: 'send_file',
        parameters: {
          fileName: res.filename,
          type: res.mimeType.includes('image')
              ? 'picture'
              : res.mimeType.includes('pdf')
                  ? 'pdf'
                  : res.mimeType.includes('spreadsheetml')
                      ? 'excel'
                      : res.mimeType.includes('wordprocessingml')
                          ? 'docs'
                          : 'file',
        },
      });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    // Optionally, handle the error (e.g., show a notification)
  }
};

const deleteFunctionSendFile = (file: any, functionIndex: number, fileIndex: number) => {
  const actions = props.botFunctions[functionIndex]?.actions;
  if (actions && Array.isArray(actions)) {
    const indexToRemove = actions.findIndex(
        (action) => action.name === 'send_file' && action.parameters.fileName === file.parameters.fileName
    );
    if (indexToRemove !== -1) {
      actions.splice(indexToRemove, 1);
    }
  }
  showFileDeleteModal.value = false;
};

// Methods to get and set values in actions

// Notify Operator Text
const getNotifyOperatorText = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'notify_operator'
      );
      return action?.parameters?.text || '';
    },
    set(value: string) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'notify_operator'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = { name: 'notify_operator', parameters: { text: value } };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.text = value;
      }
    },
  });
};

// Webhook URL
const getWebhookUrl = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'send_webhook'
      );
      return action?.parameters?.webhook_url || '';
    },
    set(value: string) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'send_webhook'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = { name: 'send_webhook', parameters: { webhook_url: value, webhook_text: '' } };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.webhook_url = value;
      }
    },
  });
};

// Webhook Text
const getWebhookText = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'send_webhook'
      );
      return action?.parameters?.webhook_text || '';
    },
    set(value: string) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'send_webhook'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = { name: 'send_webhook', parameters: { webhook_url: '', webhook_text: value } };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.webhook_text = value;
      }
    },
  });
};

// Computed properties for Custom API

// Custom API Method
const getCustomApiMethod = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'send_to_webhook'
      );
      return action?.parameters?.method || '';
    },
    set(value: string) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'send_to_webhook'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = {
          name: 'send_to_webhook',
          parameters: { method: value, url: '', queryParams: [], headers: [], bodyParams: [] },
        };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.method = value;
      }
    },
  });
};

// Custom API URL
const getCustomApiUrl = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'send_to_webhook'
      );
      return action?.parameters?.url || '';
    },
    set(value: string) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'send_to_webhook'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = {
          name: 'send_to_webhook',
          parameters: { method: '', url: value, queryParams: [], headers: [], bodyParams: [] },
        };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.url = value;
      }
    },
  });
};

// Custom API Params
const getCustomApiParams = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'send_to_webhook'
      );
      return action?.parameters?.queryParams || [];
    },
    set(value: any[]) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'send_to_webhook'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = {
          name: 'send_to_webhook',
          parameters: { method: '', url: '', queryParams: value, headers: [], bodyParams: [] },
        };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.queryParams = value;
      }
    },
  });
};

// Custom API Headers
const getCustomApiHeaders = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'send_to_webhook'
      );
      return action?.parameters?.headers || [];
    },
    set(value: any[]) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'send_to_webhook'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = {
          name: 'send_to_webhook',
          parameters: { method: '', url: '', queryParams: [], headers: value, bodyParams: [] },
        };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.headers = value;
      }
    },
  });
};

// Custom API Body
const getCustomApiBody = (index: number) => {
  return computed({
    get() {
      const action = props.botFunctions[index]?.actions?.find(
          (action: any) => action.name === 'send_to_webhook'
      );
      return action?.parameters?.bodyParams || [];
    },
    set(value: any[]) {
      // Ensure the actions array exists
      if (!props.botFunctions[index].actions) {
        props.botFunctions[index].actions = [];
      }

      let action = props.botFunctions[index].actions.find(
          (action: any) => action.name === 'send_to_webhook'
      );

      if (!action) {
        // Create the action if it doesn't exist
        action = {
          name: 'send_to_webhook',
          parameters: { method: '', url: '', queryParams: [], headers: [], bodyParams: value },
        };
        props.botFunctions[index].actions.push(action);
      } else {
        // Update the existing action
        action.parameters.bodyParams = value;
      }
    },
  });
};

// Methods to add and delete Custom API parameters
const addCustomApiParameter = (functionIndex: number, paramType: 'queryParams' | 'headers' | 'bodyParams') => {
  let action = props.botFunctions[functionIndex]?.actions?.find(
      (action: any) => action.name === 'send_to_webhook'
  );
  if (!action) {
    action = {
      name: 'send_to_webhook',
      parameters: { method: '', url: '', queryParams: [], headers: [], bodyParams: [] },
    };
    props.botFunctions[functionIndex].actions.push(action);
  }
  action.parameters[paramType].push({ title: '', kind: '', value: '' });
};

const deleteCustomApiParameter = (
    functionIndex: number,
    paramIndex: number,
    paramType: 'queryParams' | 'headers' | 'bodyParams'
) => {
  const action = props.botFunctions[functionIndex]?.actions?.find(
      (action: any) => action.name === 'send_to_webhook'
  );
  if (action && action.parameters) {
    action.parameters[paramType].splice(paramIndex, 1);
  }
};

</script>

<template>
  <div class="card-form p-fluid" style="margin-top: 16px">
    <!-- Bot Instructions -->
    <div class="field">
      <div class="flex justify-content-between align-items-end">
        <div class="flex flex-column">
          <label style="font-weight: 700">{{ t('botInstructionPrompt') }}</label>
          <span class="mb-2 mt-2">{{ t('promptUsageTip') }}</span>
        </div>
        <span style="color: #076AE1; margin-bottom: 7px">{{ t('variables') }}</span>
      </div>
      <Textarea
          :placeholder="t('youBotConsultant')"
          :autoResize="false"
          rows="25"
          cols="2"
          v-model="currentBot.instructions"
      />
    </div>

    <!-- Bot helloOnFirst -->
    <span class="bot-card__activate">
      {{ t('welcomeMessageStart') }}
      <InputSwitch v-model="currentBot.hello_on_first" style="margin-left: 8px" />
    </span>

    <!-- Bot helloMessage -->
    <div v-if="currentBot.hello_on_first" class="card-form p-fluid">
      <div class="field" style="margin-top: 12px">
        <Textarea
            :placeholder="t('autoMessageNote')"
            :autoResize="true"
            rows="3"
            cols="30"
            v-model="currentBot.helloMessage"
        />
      </div>
    </div>

    <!-- Bot Tasks -->
    <div v-if="botFunctions && botFunctions.length" class="mt-5 flex flex-column gap-4">
      <div v-for="(botFunction, index) in botFunctions" :key="index" class="task-wrapper">
        <div class="mt-3 mb-4 flex flex-column gap-3">
          <!-- Task Header -->
          <div class="flex flex-column gap-2" style="padding: 0 16px">
            <div class="flex justify-content-between w-full align-items-center mb-4">
              <div class="flex gap-3 align-items-center">
                <Badge :value="index + 1" size="large" style="background-color: #F9753E; border: none;"></Badge>
                <label style="font-weight: 700">{{ t('botTask') }}</label>
              </div>
              <i
                  class="pi pi-trash ml-auto"
                  style="cursor: pointer; color: #EE9186; font-size: 18px"
                  @click="showDeleteConfirmModal(index)"
              ></i>

              <!-- Delete Task Confirmation Dialog -->
              <Dialog v-model:visible="showFunctionDeleteModal" :header="'Удалить задачу бота?'">
                <span class="text-surface-500 dark:text-surface-400 block mb-4">
                  Вы действительно хотите удалить эту задачу?
                </span>
                <div class="flex justify-content-center gap-2 w-full">
                  <Button type="button" :label="t('delete')" severity="danger" @click="deleteFunction"></Button>
                  <Button type="button" :label="t('cancel')" @click="showFunctionDeleteModal = false"></Button>
                </div>
              </Dialog>
            </div>
            <!-- Task Prompt -->
            <Textarea rows="2" cols="30" v-model="botFunction.prompt" />
          </div>

          <!-- Actions After Task -->
          <span style="font-weight: 700; padding: 0 16px">{{ t('actionsAfterTask') }}</span>
          <div class="flex align-items-center gap-4" style="padding: 0 16px">
            <span class="bot-card__activate">
              {{ t('endDialogue') }}
              <InputSwitch v-model="getInterruptDialogue(index).value" style="margin-left: 24px" />
            </span>
            <span class="bot-card__activate">
              {{ t('isReminderStop') }}
              <InputSwitch v-model="getStopReminder(index).value" style="margin-left: 24px" />
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

          <!-- Task Parameters -->
          <div class="task-panel">
            <TabView :scrollable="true">
              <!-- Send FileInMessage Tab -->
              <TabPanel>
                <template #header>
                  <span
                      class="white-space-nowrap"
                      :class="{
                      'success-tab-title': botFunction?.actions?.some(
                        (item) => item?.name === 'send_file' && item?.parameters?.fileName
                      ),
                    }"
                  >
                    {{ t('sendFileInMessage') }}
                  </span>
                </template>
                <div class="mt-4 flex flex-column gap-4">
                  <span>{{ t('fileSendingRestrictions') }}</span>
                  <div class="flex w-full gap-3 align-items-center manage-files">
                    <Button
                        :label="t('attachFile')"
                        icon="pi pi-plus"
                        class="file-btn"
                        @click="openFileUploader(index)"
                    ></Button>
                    <input
                        :id="`file-upload-${index}`"
                        hidden
                        type="file"
                        @change="addFile($event, index)"
                    />
                    <span>{{ t('maxFileSize5MB') }}</span>
                  </div>
                  <div
                      v-if="
                      botFunction?.actions?.filter(
                        (action) => action?.name === 'send_file'
                      )?.length
                    "
                      class="files"
                  >
                    <div
                        class="flex flex-column gap-3"
                        v-for="(file, fileIndex) in botFunction?.actions?.filter(
                        (action) => action?.name === 'send_file' && action?.parameters?.fileName
                      )"
                        :key="fileIndex"
                    >
                      <div v-if="file?.parameters?.fileName">
                        <BaseFile
                            :type="file?.parameters?.type"
                            :file-name="file?.parameters?.fileName"
                            :picture="`https://api.7sales.ai/public/${file?.parameters?.fileName}`"
                            @delete="showFileDeleteModal = true"
                        />
                      </div>
                      <!-- Delete File Confirmation Dialog -->
                      <Dialog v-model:visible="showFileDeleteModal" :header="t('deleteFile')">
                        <span class="text-surface-500 dark:text-surface-400 block mb-4">
                          {{ t('confirmDeleteFile') }}
                        </span>
                        <div class="flex justify-content-center gap-2 w-full">
                          <Button
                              type="button"
                              :label="t('delete')"
                              severity="danger"
                              @click="deleteFunctionSendFile(file, index, fileIndex)"
                          ></Button>
                          <Button
                              type="button"
                              :label="t('cancel')"
                              @click="showFileDeleteModal = false"
                          ></Button>
                        </div>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <!-- CRM Tab -->
              <TabPanel>
                <template #header>
                  <span
                      class="white-space-nowrap"
                      :class="{
                      'success-tab-title': botFunction?.actions?.some(
                        (item) =>
                          (item?.name === 'add_note' && item?.parameters?.text) ||
                          (item?.name === 'edit_crm_fields' &&
                            item?.parameters?.lead_fields?.custom_fields?.some(
                              (field) =>
                                field?.field_id ||
                                field.values.some((val) => val.value)
                            ))
                      ),
                    }"
                  >
                    CRM
                  </span>
                </template>
                <h5 class="mt-4">
                  {{
                    currentBot?.channels?.some((channel) => channel.type === 'bitrix24')
                        ? t('changeDealStageBitrix')
                        : t('changeDealStage')
                  }}
                </h5>

                <div class="mt-4 flex justify-content-between gap-4 fields">
                  <!-- Choose Pipeline -->
                  <div class="flex flex-column w-full gap-2">
                    <label for="funnel">{{ t('choosePipeline') }}:</label>
                    <Dropdown
                        style="margin-top: 8px"
                        id="funnel"
                        :model-value="getFunnelId(index).value"
                        @update:model-value="getFunnelId(index).value = $event"
                        :options="funnels"
                        optionLabel="name"
                        optionValue="id"
                        :placeholder="t('chooseField')"
                    ></Dropdown>
                  </div>

                  <!-- Change Status -->
                  <div class="flex flex-column w-full gap-2">
                    <label for="statusId">{{ t('changeStatus') }}:</label>
                    <Dropdown
                        v-if="currentBot?.channels?.some((channel) => channel.type === 'bitrix24')"
                        style="margin-top: 8px"
                        id="statusId"
                        :model-value="getStatusId(index).value"
                        @update:model-value="getStatusId(index).value = $event"
                        :options="
                        funnels
                          ?.find((funnel) => funnel.id === getFunnelId(index).value)
                          ?.statuses
                      "
                        optionLabel="name"
                        optionValue="status_id"
                        :placeholder="t('chooseField')"
                    ></Dropdown>

                    <Dropdown
                        v-else
                        style="margin-top: 8px"
                        id="statusId"
                        :model-value="getStatusId(index).value"
                        @update:model-value="getStatusId(index).value = $event"
                        :options="
                        funnels
                          ?.find(
                            (funnel) =>
                              funnel?.id ===
                              botFunction?.actions?.find(
                                (action) => action?.name === 'move_in_pipeline'
                              )?.parameters?.pipeline_id
                          )
                          ?._embedded?.statuses
                      "
                        optionLabel="name"
                        optionValue="id"
                        :placeholder="t('chooseField')"
                    ></Dropdown>
                  </div>
                </div>

                <!-- Write Deal Note -->
                <div class="flex flex-column mt-3">
                  <label for="writeDealNote" style="font-weight: 700; margin-bottom: 12px;">
                    {{ t('writeDealNote') }}
                  </label>
                  <Textarea
                      :placeholder="t('dealNoteText')"
                      :autoResize="true"
                      rows="3"
                      cols="2"
                      v-model="getDealNoteText(index).value"
                  />
                </div>

                <!-- Установить значение поля -->
                <div v-if="currentBot?.channels?.some((item) => item.type === 'amocrm')" class="flex flex-column mt-3">
                  <label for="setFieldValue" style="font-weight: 700; margin-bottom: 12px;">
                    {{ t('setFieldValue') }}
                  </label>

<!--                  <pre>{{ botFunction?.actions?.find(action => action.name === 'edit_crm_fields')?.parameters.fields }}</pre>-->
                  <div
                      v-for="(field, customFieldIndex) in botFunction?.actions?.find(action => action.name === 'edit_crm_fields')?.parameters.fields"
                      :key="customFieldIndex"
                      class="fields mt-3"
                  >
                    <div class="flex align-items-center gap-4">
                      <div class="flex flex-column gap-2 w-full">
                        <label for="chooseField">{{ t('chooseField') }}</label>
                        <Dropdown
                            id="chooseField"
                            :model-value="getFieldId(index, customFieldIndex).value"
                            @update:model-value="getFieldId(index, customFieldIndex).value = $event"
                            :options="fields"
                            optionLabel="name"
                            optionGroupLabel="name"
                            optionGroupChildren="items"
                            :placeholder="t('chooseField')"
                        >
                          <template #optiongroup="slotProps">
                            <div class="flex align-items-center">
                              <div>{{ slotProps.option.name }}</div>
                            </div>
                          </template>
                        </Dropdown>
                      </div>

                      <div class="flex flex-column gap-2 w-full">
                        <label for="chooseField">{{ t('action') }}</label>
                        <!-- Adjusted Dropdown for Field Type -->
                        <Dropdown
                            id="bodyParamAction"
                            :model-value="getFieldType(index, customFieldIndex).value"
                            @update:model-value="getFieldType(index, customFieldIndex).value = $event"
                            :options="parameterActions"
                            optionLabel="title"
                            optionValue="value"
                            :placeholder="t('action')"
                        ></Dropdown>
                      </div>

                      <div class="flex flex-column gap-2 w-full">
                        <label for="enterFieldValue">{{ t('enterFieldValue') }}</label>
                        <Dropdown
                            :disabled="!field.category.length"
                            id="enterFieldValue"
                            editable
                            :options="botFunction.parameters"
                            optionLabel="name"
                            optionValue="name"
                            :model-value="getFieldValue(index, customFieldIndex).value"
                            @update:model-value="getFieldValue(index, customFieldIndex).value = $event"
                        ></Dropdown>
                      </div>

                      <i
                          class="pi pi-trash ml-auto"
                          style="cursor: pointer; color: #EE9186; font-size: 18px"
                          @click="deleteCustomFieldValue(index, customFieldIndex)"
                      ></i>
                    </div>
                  </div>


<!--                  <div-->
<!--                      v-for="(customField, customFieldIndex) in botFunction?.actions?.find(action => action.name === 'edit_crm_fields')?.parameters?.lead_fields?.custom_fields || []"-->
<!--                      :key="customFieldIndex"-->
<!--                      class="fields mt-3"-->
<!--                  >-->
<!--                    <div class="flex align-items-center gap-4">-->
                      <!-- Выбрать поле -->
<!--                      <div class="flex flex-column gap-2 w-full">-->
<!--                        <label for="chooseField">{{ t('chooseField') }}</label>-->
<!--                        <Dropdown-->
<!--                            id="chooseField"-->
<!--                            :model-value="getFieldId(index, customFieldIndex).value"-->
<!--                            @update:model-value="getFieldId(index, customFieldIndex).value = $event"-->
<!--                            :options="fields"-->
<!--                            optionLabel="name"-->
<!--                            optionGroupLabel="name"-->
<!--                            optionGroupChildren="items"-->
<!--                            :placeholder="t('chooseField')"-->
<!--                        >-->
<!--                          <template #optiongroup="slotProps">-->
<!--                            <div class="flex align-items-center">-->
<!--                              <div>{{ slotProps.option.name }}</div>-->
<!--                            </div>-->
<!--                          </template>-->
<!--                        </Dropdown>-->
<!--                      </div>-->

<!--                      <div class="flex flex-column gap-2 w-full">-->
<!--                        <label for="chooseField">{{ t('action') }}</label>-->
<!--                        &lt;!&ndash; Adjusted Dropdown for Field Type &ndash;&gt;-->
<!--                        <Dropdown-->
<!--                            id="bodyParamAction"-->
<!--                            :model-value="getFieldType(index, customFieldIndex).value"-->
<!--                            @update:model-value="getFieldType(index, customFieldIndex).value = $event"-->
<!--                            :options="parameterActions"-->
<!--                            optionLabel="title"-->
<!--                            optionValue="value"-->
<!--                            :placeholder="t('action')"-->
<!--                        ></Dropdown>-->
<!--                      </div>-->

<!--                      &lt;!&ndash; Ввести значение поля &ndash;&gt;-->
<!--                      <div class="flex flex-column gap-2 w-full">-->
<!--                        <label for="enterFieldValue">{{ t('enterFieldValue') }}</label>-->
<!--                        <Dropdown-->
<!--                            id="enterFieldValue"-->
<!--                            editable-->
<!--                            :options="botFunction.parameters"-->
<!--                            optionLabel="name"-->
<!--                            optionValue="name"-->
<!--                            :model-value="getFieldValue(index, customFieldIndex).value"-->
<!--                            @update:model-value="getFieldValue(index, customFieldIndex).value = $event"-->
<!--                        ></Dropdown>-->
<!--&lt;!&ndash;                        <InputText&ndash;&gt;-->
<!--&lt;!&ndash;                            id="enterFieldValue"&ndash;&gt;-->
<!--&lt;!&ndash;                            type="text"&ndash;&gt;-->
<!--&lt;!&ndash;                            :model-value="getFieldValue(index, customFieldIndex).value"&ndash;&gt;-->
<!--&lt;!&ndash;                            @update:model-value="getFieldValue(index, customFieldIndex).value = $event"&ndash;&gt;-->
<!--&lt;!&ndash;                        />&ndash;&gt;-->
<!--                      </div>-->
<!--                      <i-->
<!--                          class="pi pi-trash ml-auto"-->
<!--                          style="cursor: pointer; color: #EE9186; font-size: 18px"-->
<!--                          @click="deleteCustomFieldValue(index, customFieldIndex)"-->
<!--                      ></i>-->
<!--                    </div>-->
<!--                  </div>-->

                  <!-- Кнопка для добавления нового поля -->
                  <Button
                      label="+"
                      style="background-color: #71BA76; width:50px; border: none"
                      class="add-btn mt-3"
                      @click="addCustomFieldsValues(index)"
                  />
                </div>
              </TabPanel>

              <!-- Notification Tab -->
              <TabPanel>
                <template #header>
                  <span
                      class="white-space-nowrap"
                      :class="{
                      'success-tab-title': botFunction?.actions?.some(
                        (item) => item?.name === 'notify_operator' && item?.parameters?.text
                      ),
                    }"
                  >
                    {{ t('notification') }}
                  </span>
                </template>
                <div class="flex flex-column gap-3">
                  <span style="font-weight: 700" class="mt-5">
                    {{ t('notificationText') }}
                  </span>
                  <Textarea
                      :autoResize="true"
                      rows="3"
                      cols="2"
                      v-model="getNotifyOperatorText(index).value"
                  />
                </div>
              </TabPanel>

              <!-- Webhook Tab -->
<!--              <TabPanel>-->
<!--                <template #header>-->
<!--                  <span-->
<!--                      class="white-space-nowrap"-->
<!--                      :class="{-->
<!--                      'success-tab-title': botFunction?.actions?.some(-->
<!--                        (item) =>-->
<!--                          item?.name === 'send_webhook' &&-->
<!--                          item?.parameters?.webhook_url &&-->
<!--                          item?.parameters?.webhook_text-->
<!--                      ),-->
<!--                    }"-->
<!--                  >-->
<!--                    Webhook-->
<!--                  </span>-->
<!--                </template>-->
<!--                <div class="flex flex-column gap-3">-->
<!--                  <div class="flex flex-column gap-2 mt-5">-->
<!--                    <span style="font-weight: 700">URL</span>-->
<!--                    <InputText-->
<!--                        style="margin-bottom: 8px"-->
<!--                        id="webhookUrl"-->
<!--                        type="text"-->
<!--                        v-model="getWebhookUrl(index).value"-->
<!--                        :placeholder="t('requestUrl')"-->
<!--                    />-->
<!--                  </div>-->
<!--                  <div class="flex flex-column gap-2">-->
<!--                    <span style="font-weight: 700">{{ t('text') }}</span>-->
<!--                    <Textarea-->
<!--                        rows="3"-->
<!--                        cols="30"-->
<!--                        v-model="getWebhookText(index).value"-->
<!--                    />-->
<!--                  </div>-->
<!--                </div>-->
<!--              </TabPanel>-->

              <!-- CUSTOM API Tab -->
              <TabPanel>
                <template #header>
                  <span
                      class="white-space-nowrap"
                      :class="{
                      'success-tab-title': botFunction?.actions?.some(
                        (item) => item?.name === 'send_to_webhook' && item?.parameters?.url
                      ),
                    }"
                  >
                    Webhook
                  </span>
                </template>
                <div class="mx-2">
                  <div
                      class="flex flex-column mt-3 mb-3 px-2 py-2"
                      style="background: #FFEFE5; border-radius: 6px"
                  >
                    <label
                        for="customApi"
                        style="font-weight: 700; margin-bottom: 12px;"
                    >
                      CUSTOM API
                    </label>
                    <div class="flex flex-column gap-2">
                      <span>{{ t('restApiSettings') }}</span>
                      <div class="flex gap-2 align-items-center">
                        <Dropdown
                            style="margin-top: 8px; margin-bottom: 8px"
                            id="customApiMethod"
                            v-model="getCustomApiMethod(index).value"
                            :options="customApiMethods"
                            optionLabel="title"
                            optionValue="value"
                            :placeholder="t('requestMethod')"
                        ></Dropdown>
                        <InputText
                            id="customApiUrl"
                            type="text"
                            v-model="getCustomApiUrl(index).value"
                            :placeholder="t('requestUrl')"
                        />
                      </div>
                    </div>

                    <!-- API Parameters -->
                    <div class="mt-3">
                      <span class="mb-2">{{ t('apiParams') }} (params):</span>
                      <div
                          v-for="(parameter, paramIndex) in getCustomApiParams(index).value"
                          :key="paramIndex"
                          class="flex align-items-center gap-2 mt-2"
                      >
                        <InputText
                            id="parameterTitle"
                            type="text"
                            v-model="parameter.title"
                            :placeholder="t('variableName')"
                        />
                        <Dropdown
                            style="margin-top: 8px; margin-bottom: 8px"
                            id="parameterAction"
                            v-model="parameter.kind"
                            :options="parameterActions"
                            optionLabel="title"
                            optionValue="value"
                            :placeholder="t('action')"
                        ></Dropdown>
                        <template v-if="parameter.kind === 'static'">
                          <InputText
                              :placeholder="t('valueToPass')"
                              id="parameterActionText"
                              v-model="parameter.value"
                          ></InputText>
                        </template>
                        <template v-if="parameter.kind === 'user_data'">
                          <Dropdown
                              v-model="parameter.value"
                              :options="userDataFields"
                              optionLabel="rus_name"
                              optionValue="value"
                              :placeholder="t('valueToPass')"
                          ></Dropdown>
                        </template>
                        <template v-if="parameter.kind === 'function_parameter'">
                          <Dropdown
                              v-model="parameter.value"
                              :options="botFunction.parameters"
                              optionLabel="name"
                              optionValue="name"
                              :placeholder="t('valueToPass')"
                          ></Dropdown>
                        </template>
                        <i
                            class="pi pi-trash ml-auto"
                            style="cursor: pointer; color: #EE9186; font-size: 18px"
                            @click="deleteCustomApiParameter(index, paramIndex, 'queryParams')"
                        ></i>
                      </div>
                      <Button
                          class="mt-3 text-center"
                          @click="addCustomApiParameter(index, 'queryParams')"
                          :label="`+ ${t('newParameter')}`"
                      ></Button>
                    </div>

                    <!-- API Headers -->
                    <div class="mt-3">
                      <span class="mb-2">{{ t('apiHeaders') }} (headers):</span>
                      <div
                          v-for="(header, headerIndex) in getCustomApiHeaders(index).value"
                          :key="headerIndex"
                          class="flex align-items-center gap-2 mt-2"
                      >
                        <InputText
                            id="headerTitle"
                            type="text"
                            v-model="header.title"
                            :placeholder="t('name')"
                        />
                        <InputText
                            id="headerValue"
                            type="text"
                            v-model="header.value"
                            :placeholder="t('value')"
                        />
                        <i
                            class="pi pi-trash ml-auto"
                            style="cursor: pointer; color: #EE9186; font-size: 18px"
                            @click="deleteCustomApiParameter(index, headerIndex, 'headers')"
                        ></i>
                      </div>
                      <Button
                          class="mt-3 text-center"
                          @click="addCustomApiParameter(index, 'headers')"
                          :label="`+ ${t('newParameter')}`"
                      ></Button>
                    </div>

                    <!-- API Body -->
                    <div class="mt-3">
                      <span class="mb-2">{{ t('apiBody') }} (body):</span>
                      <div
                          v-for="(bodyParam, bodyIndex) in getCustomApiBody(index).value"
                          :key="bodyIndex"
                          class="flex align-items-center gap-2 mt-2"
                      >
                        <InputText
                            id="bodyParamTitle"
                            type="text"
                            v-model="bodyParam.title"
                            :placeholder="t('variableName')"
                        />
                        <Dropdown
                            style="margin-top: 8px; margin-bottom: 8px"
                            id="bodyParamAction"
                            v-model="bodyParam.kind"
                            :options="parameterActions"
                            optionLabel="title"
                            optionValue="value"
                            :placeholder="t('action')"
                        ></Dropdown>
                        <template v-if="bodyParam.kind === 'static'">
                          <InputText
                              :placeholder="t('valueToPass')"
                              id="bodyParamActionText"
                              v-model="bodyParam.value"
                          ></InputText>
                        </template>
                        <template v-if="bodyParam.kind === 'user_data'">
                          <Dropdown
                              v-model="bodyParam.value"
                              :options="userDataFields"
                              optionLabel="rus_name"
                              optionValue="value"
                              :placeholder="t('valueToPass')"
                          ></Dropdown>
                        </template>
                        <template v-if="bodyParam.kind === 'function_parameter'">
                          <Dropdown
                              v-model="bodyParam.value"
                              :options="botFunction.parameters"
                              optionLabel="name"
                              optionValue="name"
                              :placeholder="t('valueToPass')"
                          ></Dropdown>
                        </template>
                        <i
                            class="pi pi-trash ml-auto"
                            style="cursor: pointer; color: #EE9186; font-size: 18px"
                            @click="deleteCustomApiParameter(index, bodyIndex, 'bodyParams')"
                        ></i>
                      </div>
                      <Button
                          class="mt-3 text-center"
                          @click="addCustomApiParameter(index, 'bodyParams')"
                          :label="`+ ${t('newParameter')}`"
                      ></Button>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </div>
    <!-- Add Task Button -->
    <Button
        :label="t('addTask')"
        style="background-color: #F9753E; border: none"
        class="add-btn mt-3"
        @click="addTask"
    />
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
  grid-template-columns: repeat(5, minmax(0, 150px));
  gap: 16px;
}

@media (max-width: 1530px) {
  .file-btn {
    width: 30% !important;
  }
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
</style>
