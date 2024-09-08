<script setup lang="ts">
import { computed } from 'vue';
import pdfIcon from '@/assets/icons/pdf.svg';
import docsIcon from '@/assets/icons/docs.svg';
import excelIcon from '@/assets/icons/excel.svg';
import fileIcon from '@/assets/icons/file.svg';


interface PropsItem {
  type: 'pdf' | 'docs' | 'excel' | 'picture' | 'files';
  picture?: string;
  fileName: string;
}

const props = withDefaults(defineProps<PropsItem>(), {
  type: 'picture',
  picture: '',
});

const emit = defineEmits<{
  (e: 'delete'): void;
}>();

const svgIcons = {
  pdf: pdfIcon,
  docs: docsIcon,
  excel: excelIcon,
  file: fileIcon,
  picture: '', // For pictures, we'll use the `picture` prop instead of an SVG
};

const iconSrc = computed(() => {
  return props.type === 'picture' && props.picture
      ? props.picture
      : svgIcons[props.type];
});

const handleDelete = () => {
  emit('delete');
};

const iconSize = computed(() => {
  return props.type === 'picture' ? '150px' : '100px';
});

const fileNameParts = computed(() => {
  const { fileName } = props;
  const visiblePart = fileName?.slice(0, -5);
  const extension = fileName?.slice(-5); // Last 5 characters
  return { visiblePart, extension };
});

</script>

<template>
  <div class="file-item">
    <div class="icon-container">
      <img
          :src="iconSrc"
          alt="file icon"
          class="file-icon"
          :style="{ width: iconSize, height: iconSize }"
      />
      <button class="delete-button" @click="handleDelete">
        <i class="pi pi-trash ml-auto " style="cursor: pointer; color: #EE9186; font-size: 18px"></i>
      </button>
    </div>
    <div class="file-name mt-3">
      <div class="file-name-visible">{{ fileNameParts.visiblePart }}</div>
      <div class="file-name-extension">{{ fileNameParts.extension }}</div>
    </div>
  </div>
</template>

<style scoped>
.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  width: 100%;
}

.icon-container {
  position: relative;
  display: inline-block;
}

.file-icon {
  object-fit: cover;
  position: relative;
  border-radius: 4px;
}

.delete-button {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: white;
  border: none;
  cursor: pointer;
  color: black;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.delete-button:hover {
  background-color: #f8d7da;
}

.delete-icon {
  font-size: 16px;
  line-height: 1;
}

.file-name {
  font-size: 14px;
  text-align: center;
}

.file-name-visible {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Adjust as needed */
}

.file-name-extension {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Adjust as needed */
}
</style>
