<script setup lang="ts">
console.log('Inside Tokens')
import { useDashboardStore } from "~/src/shared/store/dashboard";
import { useTariffsStore } from "~/src/shared/store/tariffs";

const { t } = useI18n();

const dashboardStore = useDashboardStore();
const tariffsStore = useTariffsStore();

onMounted(async () => {
  await Promise.all([
    dashboardStore.loadTariffsToken(),
    tariffsStore.loadTariffs()
  ])
})

const insideTokens = computed(() => {
  return dashboardStore.getInsideTokens
})


const isEditModal = ref<boolean>(false)
const selectedTariffId = ref<string | null>(null);

const inputTokenPrice = ref<number | null>(null);
const outputTokenPrice = ref<number | null>(null);

const openDeleteUserModal = (value: string) => {
  isEditModal.value = true;
  selectedTariffId.value = value;
  if (value) {
    inputTokenPrice.value = insideTokens.value?.find((item) => item._id === value)?.priceInputToken
    outputTokenPrice.value = insideTokens.value?.find((item) => item._id === value)?.priceOutputToken
  }
}

const updateTariff = async () => {
  await dashboardStore.changeTokenPrice(selectedTariffId.value, inputTokenPrice.value, outputTokenPrice.value).then(async (res) => {
    if (res?.success) {
      await dashboardStore.loadTariffsToken();
      isEditModal.value = false;
      selectedTariffId.value = null;
      inputTokenPrice.value = null;
      outputTokenPrice.value = null;
    }
  })
}


</script>

<template>
  <Dialog v-model:visible="isEditModal" modal header="Изменить тариф" :style="{ width: '25rem' }">
    <div class="flex flex-column gap-2">
      <div class="flex flex-column gap-1">
        <span style="font-weight: 700">Price/Input Token, Руб</span>
        <InputText style="margin-bottom: 16px; width: 100%" id="input-balance" type="number" min="1" v-model="inputTokenPrice" />
      </div>
      <div class="flex flex-column gap-1">
        <span style="font-weight: 700">Price/Output Token, Руб</span>
        <InputText style="margin-bottom: 16px; width: 100%" id="output-balance" type="number" min="1" v-model="outputTokenPrice" />
      </div>
    </div>
    <div class="flex justify-content-center gap-2 w-full">
      <Button type="button" :label="t('save')" @click="updateTariff"></Button>
      <Button type="button" :label="t('cancel')" @click="isEditModal = false" severity="danger"></Button>
    </div>
  </Dialog>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <h5>Inside Tokens</h5>
        <DataTable :value="insideTokens">
          <Column field="_id" header="ID"></Column>
          <Column field="name" header="Имя"></Column>
          <Column field="priceInputToken" header="Price/Input Token, Руб"></Column>
          <Column field="priceOutputToken" header="Price/Output Token, Руб"></Column>
          <Column header="Действия">
            <template #body="{ data }">
              <i class="pi pi-pencil" style="cursor: pointer; color: #EE9186; font-size: 18px" @click="openDeleteUserModal(data?._id)"></i>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>