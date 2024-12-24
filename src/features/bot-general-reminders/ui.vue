<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

// Props
const props = defineProps({
  reminders: {
    type: Array,
    required: true,
  },
});

// Emits
const emit = defineEmits(['update-reminders']);

const { t } = useI18n();

const showReminderDeleteModal = ref<boolean>(false);
const reminderId = ref<number>(0); // Keep only one declaration of reminderId

const timeList = ref([
  {
    id: 'minutes',
    title: t('perMinutes'),
  },
  {
    id: 'hours',
    title: t('perHour'),
  },
]);

const messageTypes = ref([
  {
    id: 'message',
    title: t('sendMyMessage'),
  },
  {
    id: 'prompt',
    title: t('generateUsingAI'),
  },
]);

const deleteReminder = () => {
  const updatedReminders = props.reminders.filter(
      (reminder) => reminder.id !== reminderId.value
  );
  emit('update-reminders', updatedReminders);
  hideDeleteReminderModal();
};

const showDeleteReminderModal = (id: number) => {
  showReminderDeleteModal.value = true;
  reminderId.value = id;
};

const hideDeleteReminderModal = () => {
  showReminderDeleteModal.value = false;
  reminderId.value = 0;
};

const addReminder = () => {
  const newReminder = {
    id: props.reminders.length + 1,
    quantity: 10,
    message: '',
    timeframe: 'minutes',
    type: 'message',
    isSchedule: false,
    isActiveReminder: true,
    schedule: {
      start: '',
      end: '',
    },
  };
  emit('update-reminders', [...props.reminders, newReminder]);
};
</script>

<template>
  <div>
    <div v-if="reminders?.length">
      <div v-for="(message, i) in reminders" :key="i" class="mt-4 flex align-items-center gap-8 w-full">
        <div class="flex flex-column w-full task-wrapper">
          <div class="flex align-items-center justify-content-between">
            <div class="text-xl">{{ i+1 }}. {{ $t('clientMessage')}}</div>
            <i class="pi pi-trash ml-auto " style="cursor: pointer; color: #EE9186; font-size: 18px" @click="showDeleteReminderModal(message.id)"></i>
            <Dialog v-model:visible="showReminderDeleteModal" :header="'Удалить напоминание'">
              <span class="text-surface-500 dark:text-surface-400 block mb-4">Вы действительно хотите удалить это напоминание?</span>
              <div class="flex justify-content-center gap-2 w-full">
                <Button type="button" :label="t('delete')" severity="danger" @click="deleteReminder(reminderId)"></Button>
                <Button type="button" :label="t('cancel')" @click="hideDeleteReminderModal"></Button>
              </div>
            </Dialog>
          </div>
          <div class="flex align-items-center gap-3 ml-4 mt-4">
            <span>{{ $t('clientNoResponseTime') }}</span>
            <InputText id="quantity" type="number" min="1" style="max-width: 70px" v-model="message.quantity"/>
            <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="timeItem" v-model="message.timeframe" :options="timeList" optionLabel="title" option-value="id"></Dropdown>
          </div>
          <Dropdown class="ml-4 mt-2 mb-2" id="messageType" v-model="message.type" :options="messageTypes" optionLabel="title" option-value="id" :placeholder="t('chooseOption')"></Dropdown>
          <InputText v-if="message.type ==='message'" class="ml-4 mt-4" id="purchaseDecision" type="text" :placeholder="t('purchaseDecision')" v-model="message.message" />
          <Textarea v-if="message.type ==='prompt'" class="ml-4 mt-4" id="analyzeLast5Messages" type="text" :placeholder="t('analyzeLast5Messages')" :autoResize="true" rows="1" cols="2" v-model="message.message" />
          <div class="field" style="margin-top: 12px; margin-left: 21px">
            <label for="name1" style="font-weight: 700">{{ $t('workingHours') }}</label>
            <span class="bot-card__activate" style="margin-top: 8px">
                    {{ $t('works247') }}
                  </span>
            <span class="bot-card__activate">
                    {{ $t('setWorkingHours') }}
                    <InputSwitch v-model="message.isSchedule" style="margin-left: 8px"/>
                  </span>
            <span class="bot-card__activate" style="margin-top: 8px">
                    {{ $t('onOffButton') }}
                    <InputSwitch v-model="message.isActiveReminder" style="margin-left: 8px"/>
                  </span>

            <!--                        <Dropdown style="margin-top: 8px; margin-bottom: 8px" id="workingZone" v-model="message.schedule.timezone" :options="workingZones" optionLabel="title" option-value="id" :placeholder="t('chooseOption')"></Dropdown>-->
            <div v-if="message.isSchedule" class="flex align-items-center gap-2 mt-3">
              <div class="flex flex-column gap-1">
                <span>Начало:</span>
                <Calendar :dateFormat="'HH:mm'" id="calendar-timeonly" timeOnly v-model="message.schedule.start" />
              </div>
              <div class="flex flex-column gap-1">
                <span>Конец:</span>
                <Calendar :dateFormat="'HH:mm'" id="calendar-timeonly" timeOnly v-model="message.schedule.end" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Button :label="t('addMessage')" class="mt-4" @click="addReminder"/>
  </div>
</template>

<style scoped>

</style>