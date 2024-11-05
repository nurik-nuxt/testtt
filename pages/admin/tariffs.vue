<script setup lang="ts">
import { useDashboardStore } from "~/src/shared/store/dashboard";
import { FilterMatchMode } from '@primevue/core/api';
import { useTariffsStore } from "~/src/shared/store/tariffs";

const dashboardStore = useDashboardStore();
const tariffsStore = useTariffsStore();

onMounted(async () => {
  await dashboardStore.loadUsers(true);
  await tariffsStore.loadTariffs();
})

const users = computed(() => {
  return dashboardStore.getUsers;
});

const tariffs = computed(() => {
  return tariffsStore.getTariffs?.map((item) => {
    return {
      ... item,
      full_name: `${item.display_name} - ${item?.limits?.leads}`
    }
  })
})

const selectedUserId = ref<string>('');
const isOpenUserDeleteModal = ref<boolean>(false)
const openDeleteUserModal = (id: string) => {
  isOpenUserDeleteModal.value = true
  selectedUserId.value = id;
}
const filters = ref({});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};
initFilters();

const clearFilter = () => {
  initFilters();
};
const { t } = useI18n();

const connectTariff = async (email: string) => {
  await tariffsStore.assignTariff([{email}]).then(async () => {
    await dashboardStore.loadUsers(true)
  })
}

const showAvailableTariffs = ref<boolean>(false)
const selectedEmail = ref<string | null>(null)
const updateTariff = (email: string) => {
  showAvailableTariffs.value = true
  selectedEmail.value = email
}

const totalUpgradeTariffTime = ref<'per_month' | 'per_year'>('per_month')

const tariffUpgradeTimeList = ref<{ title: string; value: string }[]>(
    [
      {
        title: 'в мес',
        value: 'per_month'
      },
      {
        title: 'в год',
        value: 'per_year'
      }
    ]
)

const payUpgradeTariff = async () => {
  if (selectedEmail.value) {
    await tariffsStore.assignTariff([{email: selectedEmail.value, tariff_id: selectedUpgradeTariffId.value, recurrence: totalUpgradeTariffTime.value}]).then(async () => {
      await dashboardStore.loadUsers(true)
      selectedEmail.value = null;
      selectedUpgradeTariffId.value = null;
      showAvailableTariffs.value = false
    })
  }
}

const selectedUpgradeTariffId = ref()

</script>

<template>
  <div class="grid">
    <Dialog v-model:visible="showAvailableTariffs" :style="{ width: '450px' }" header="Выберите тариф" :modal="true" class="p-fluid">
      <div class="mb-4">
        <SelectButton v-model="totalUpgradeTariffTime" :options="tariffUpgradeTimeList" option-label="title" option-value="value" :allow-empty="false" @change="changeRecurrence" />
      </div>
      <Dropdown
          v-model="selectedUpgradeTariffId"
          :options="tariffs"
          class="w-full"
          option-value="_id"
          option-label="full_name"
      >
        <template #option="slotProps">
          <div class="flex justify-content-between align-items-center w-full">
            <span>{{ slotProps.option.display_name }} - {{ slotProps.option.limits.leads }}</span>
          </div>
        </template>
      </Dropdown>
      <Button label="Обновить тариф" class="mt-4" @click="payUpgradeTariff"></Button>
    </Dialog>

    <div class="col-12">
      <div class="card h-full">
        <h5>Пользователи</h5>
        <DataTable v-model:filters="filters" :value="users" :globalFilterFields="['_id', 'name', 'email', 'role']" showGridlines>
          <template #header>
            <div class="flex justify-content-between w-full">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Поиск" />
              </IconField>
            </div>
          </template>
          <Column field="_id" header="ID"></Column>
          <Column field="name" header="Имя"></Column>
          <Column field="email" header="Email"></Column>
          <Column field="role" header="Роль"></Column>
          <Column field="tariff" header="Тариф">
            <template #body="slotProps">
              {{ tariffs?.find((tariff) => tariff?._id === slotProps.data.tariff?.tariff_id)?.rus_name }} {{ tariffs?.find((tariff) => tariff?._id === slotProps.data.tariff?.tariff_id)?.limits?.leads }}
            </template>
          </Column>
          <Column header="Действия">
            <template #body="{ data }">
              <Button v-if="!data?.tariff" label="Подключить тариф" class="p-3 mt-auto" style="height: 30px;" @click="connectTariff(data?.email)"></Button>
              <Button v-else label="Обновить тариф" style="background-color: #F9753E; border: none" @click="updateTariff(data?.email)"></Button>
<!--              <i class="pi pi-trash" style="cursor: pointer; color: #EE9186; font-size: 18px" @click="openDeleteUserModal(data?._id)"></i>-->
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
