<script setup lang="ts">

import { useKnowledgeStore } from "~/src/shared/store/knowledge";
const { t } = useI18n();
const route = useRoute();

const knowledgeStore = useKnowledgeStore();
const filters = ref({});


const createKnowledgeBase = (id: number) => {
  return navigateTo({ name: 'chatbots-knowledge-id', params: { id: id }})
}

const knowledgeBaseSelectedKey = ref(null);

const files = computed(() => {
  return knowledgeStore.getKnowledgeList
});

const deleteKnowledgeFile = async (knowledgeId: string) => {
  await knowledgeStore.deleteKnowledgeFile(<string>route.params.id, knowledgeId).then(async (res) => {
    if (res.success) {
      await knowledgeStore.getKnowledgeListByBot(<string>route.params.id)
    }
  })
}

const editKnowledgeFile = (knowledgeId: string) => {
  return navigateTo({ name: 'chatbots-knowledge-edit-id', params: { id: route.params.id }, query: { knowledgeId: knowledgeId }})
}

</script>

<template>
  <div class="flex gap-2 mt-5" style="margin-left: 1rem">
    <Button :label="t('createFile')" @click="createKnowledgeBase(route.params.id)"/>
    <Button :label="t('uploadFail')"/>
    <Button :label="t('delete')" :disabled="!knowledgeBaseSelectedKey" />
  </div>
  <div class="table-container">
    <TreeTable v-model:selectionKeys="knowledgeBaseSelectedKey" :value="files" selectionMode="checkbox" tableStyle="min-width: 100rem">
      <template #header>
        <div class="text-left">
          <InputText v-model="filters['global']" :placeholder="t('searchBase')" />
        </div>
      </template>
      <Column field="label" :header="t('title')" :expander="true" style="width: 40%"></Column>
      <Column field="notification" :header="t('notifications')" class="ml-auto">
        <template #body="slotProps">
          <div>
            <i v-if="slotProps?.node?.data?.notification" class="pi pi-check-circle"></i>
            <i v-else class="pi pi-circle"></i>
          </div>
        </template>
      </Column>
      <Column field="notification" :header="t('stopBotButton')">
        <template #body="slotProps">
          <div>
            <i v-if="!slotProps?.node?.data?.notification" class="pi pi-check-circle"></i>
            <i v-else class="pi pi-circle"></i>
          </div>
        </template>
      </Column>
      <Column field="notification" :header="t('reminders')">
        <template #body="slotProps">
          <div>
            <i class="pi pi-check-circle"></i>
          </div>
        </template>
      </Column>

      <Column field="actions">
        <template #body="slotProps">
          <div class="flex flex-row-reverse gap-3 ml-auto">
            <i style="cursor: pointer; color: #EE9186;" class="pi pi-trash" @click="deleteKnowledgeFile(slotProps?.node?.key)" />
            <i style="cursor: pointer" class="pi pi-file-edit" @click="editKnowledgeFile(slotProps?.node?.key)" />
            <i style="cursor: pointer; color: #187CF9" class="pi pi-download" />
          </div>
        </template>
      </Column>
    </TreeTable>
  </div>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
}

</style>