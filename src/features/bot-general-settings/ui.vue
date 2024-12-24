
<script setup lang="ts">
import {queryGetModelList} from "~/src/shared/repository/dictionaries";

const { t } = useI18n();
import useValidate from "@vuelidate/core/dist/index";
import { helpers, required, requiredIf } from "@vuelidate/validators";

const { data: models, suspense: suspenseModels } = queryGetModelList();

await suspenseModels();


const props = defineProps({
  currentBot: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  isValidatedApiSecretKey: {
    type: Boolean,
    required: true,
  },
  workingZones: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:currentBot', 'confirmBotMainSettings', 'removeBot']);

// Определяем переменные
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
  },
]);


const limitDays = ref([
  {
    title: t('perDay'),
    id: 'day',
  },
  {
    title: t('perHour'),
    id: 'hour',
  },
]);

// Правила валидации
const botRules = computed(() => ({
  name: {
    required: helpers.withMessage(t('required'), required),
  },
  apiKey: {
    requiredIf: helpers.withMessage(t('required'), requiredIf(() => props.currentBot.apiKeyType === 'own')),
  },
}));

const v$ = useValidate(botRules, props.currentBot);

// Методы
const confirmBotMainSettings = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    emit('confirmBotMainSettings');
  }
};

const removeBot = () => {
  emit('removeBot');
};

// Следим за изменениями currentBot и эмитим событие в родительский компонент
watch(
    () => props.currentBot,
    (newVal) => {
      emit('update:currentBot', newVal);
    },
    { deep: true }
);

const time = ref('22:00')
</script>

<template>
  <div>
    <div class="card-form p-fluid" style="margin-top: 16px">

      <!--Bot name-->
      <div class="field">
        <label for="name1" style="font-weight: 700">{{ $t('botName') }}</label>
        <InputText id="botName" type="text" v-model="currentBot.name" :invalid="v$.$errors.find((el) => el.$property === 'name')?.$message" />
      </div>
    </div>
    <div class="card-form p-fluid" style="margin-top: 12px">

      <!--Bot apiSecretKey-->
      <label for="name1" style="font-weight: 700">{{ $t('apiSecretKey') }}</label>
      <Dropdown class="mb-2" style="margin-top: 8px" id="apiKey" v-model="currentBot.apiKeyType" :options="apiKeyTypes" optionLabel="title" option-value="code" :placeholder="t('chooseOption')" option-disabled="disabled"></Dropdown>
      <InputText v-if="currentBot.apiKeyType === 'own'" style="margin-top: 8px; margin-bottom: 16px;" id="name1" v-model="currentBot.apiKey" :placeholder="t('apiKey')" :invalid="v$.$errors.find((el) => el.$property === 'apiKey')?.$message" />

      <!--Bot model-->
      <label for="name1" style="font-weight: 700">{{ $t('model') }}</label>
      <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="apiKey" v-model="currentBot.model" :options="models" optionLabel="name" option-value="name" :placeholder="t('chooseOption')"></Dropdown>
      <span style="color: #64748b">{{ $t('modelChoice') }}</span>

      <div class="field" style="margin-top: 12px">
        <label for="name1" style="font-weight: 700">{{ $t('temperature') }}</label>
        <InputText style="margin-bottom: 8px" id="temperatureValue" type="number" min="1" v-model.number="currentBot.temperature" :disabled="true" />
        <Slider style="margin-bottom: 8px" v-model="currentBot.temperature" :min="0" :max="2" :step="0.1"/>
        <span style="color: #64748b">{{ $t('creativityLevel') }}</span>
      </div>

      <div class="field" style="margin-top: 12px">
        <label for="name1" style="font-weight: 700">{{ $t('messageMergeTimeout') }}</label>
        <InputText style="margin-bottom: 8px" id="name1" type="number" min="1" v-model="currentBot.smallTimeout"/>
        <span style="color: #64748b">{{ $t('messageWaitTime') }}</span>
      </div>


      <!--Bot operatorStopTime-->
      <div class="field" style="margin-top: 12px">
        <label for="name1" style="font-weight: 700">{{ $t('pauseMinutes') }}</label>
        <InputText style="margin-bottom: 8px" id="name1" type="number" min="1" v-model="currentBot.operatorStopTime" />
        <span style="color: #64748b">{{ $t('pauseOperator') }}</span>
      </div>

      <!--Bot messageLimit-->
      <div class="field" style="margin-top: 12px">
        <label for="name1" style="font-weight: 700">{{ $t('limitingAIbot') }}</label>
        <div class="flex align-items-center gap-2">
          <span>{{ $t('maxMessages') }}</span>
          <InputText id="message-limit-qty" type="number" min="1" style="max-width: 150px" v-model="currentBot.messageLimit.qty"/>
          <span>{{ $t('onceWhile') }}</span>
          <InputText id="message-limit-period" type="number" min="1" style="max-width: 150px" v-model="currentBot.messageLimit.period"/>
          <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="message-limit-granularity" v-model="currentBot.messageLimit.granularity" :options="limitDays" optionLabel="title" option-value="id" :placeholder="t('chooseOption')"></Dropdown>
        </div>
      </div>

      <h5>{{ $t('manageBotMessages') }}</h5>
      <span>{{ $t('operatorControlPhrases') }}</span>

      <!--Bot stopBot-->
      <div class="field" style="margin-top: 12px">
        <label for="name1" style="font-weight: 700">{{ $t('stopBot') }}</label>
        <InputText style="margin-bottom: 8px" id="stopBot" type="text" v-model="currentBot.controlSignals.stopBot" />
      </div>

      <!--Bot stopBot-->
      <div class="field" style="margin-top: 12px">
        <label for="name1" style="font-weight: 700">{{ $t('resumeBot') }}</label>
        <InputText style="margin-bottom: 8px" id="resumeBot" type="text" v-model="currentBot.controlSignals.continueBot" />
      </div>

      <div class="field" style="margin-top: 12px">
        <label for="name1" style="font-weight: 700">{{ $t('workingHours') }}</label>
        <span class="bot-card__activate" style="margin-top: 8px">
          {{ $t('works247') }}
        </span>
        <span class="bot-card__activate">
          {{ $t('setWorkingHours') }}


          <InputSwitch v-model="currentBot.schedule.isSchedule" style="margin-left: 8px"/>
        </span>
        <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="workingZone" v-model="currentBot.schedule.timezone" :options="workingZones" optionLabel="title" option-value="id" :placeholder="t('chooseOption')"></Dropdown>
        <div v-if="currentBot.schedule.isSchedule" class="flex flex-column gap-2 mt-3">
          <div class="flex align-items-center gap-2" v-for="(workingHour, index) in currentBot.schedule.workingHours" :key="index">

            <span style="width: 25px">{{ workingHour.title }}:</span>

            <Calendar :dateFormat="'HH:mm'" :disabled="!workingHour.isWork" id="calendar-timeonly" timeOnly v-model="workingHour.start" />
            <span>-</span>
            <Calendar :dateFormat="'HH:mm'" :disabled="!workingHour.isWork" id="calendar-timeonly" timeOnly v-model="workingHour.end" />
            <span class="bot-card__activate" >
              {{ $t('works') }}
              <InputSwitch v-model="workingHour.isWork" style="margin-left: 8px"/>
            </span>
          </div>
        </div>
      </div>

    </div>
    <div class="mt-4 flex gap-4 align-items-center justify-content-end">
      <Button :label="t('deleteBotButton')" severity="danger" class="mr-auto" @click="removeBot"></Button>
      <nuxt-link to="/chatbots" style="color: #334155">{{ $t('goBack')}}</nuxt-link>
      <Button :label="t('save')" @click="confirmBotMainSettings" :disabled="loading || isValidatedApiSecretKey"></Button>
    </div>
  </div>
</template>
