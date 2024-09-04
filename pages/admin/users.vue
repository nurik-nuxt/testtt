<script setup lang="ts">
import { useDashboardStore } from "~/src/shared/store/dashboard";
import { FilterMatchMode } from '@primevue/core/api';

const dashboardStore = useDashboardStore();
onMounted(async () => {
  await dashboardStore.loadUsers();
})

const users = computed(() => {
  return dashboardStore.getUsers;
});

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

const confirmDeleteUser = async () => {
  await dashboardStore.deleteUser(selectedUserId.value).then(async (res) => {
    if (res?.success) {
      isOpenUserDeleteModal.value = false;
      await dashboardStore.loadUsers();
    }
  })
}
</script>

<template>
  <Dialog v-model:visible="isOpenUserDeleteModal" modal :header="t('deleteUser')" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">{{ t('deleteUserConfirm1') }}</span>
    <div class="flex justify-content-center gap-2 w-full">
      <Button type="button" :label="t('yes')" severity="danger" @click="confirmDeleteUser"></Button>
      <Button type="button" :label="t('cancel')" @click="isOpenUserDeleteModal = false"></Button>
    </div>
  </Dialog>
  <div class="grid">
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
          <Column field="phone" header="Телефон"></Column>
          <Column field="role" header="Роль"></Column>
          <Column header="Действия">
            <template #body="{ data }">
              <i class="pi pi-trash" style="cursor: pointer; color: #EE9186; font-size: 18px" @click="openDeleteUserModal(data?._id)"></i>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>