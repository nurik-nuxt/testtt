<script setup lang="ts">
console.log('Admin products');
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex flex-column gap-3">
          <div class="flex align-items-center justify-content-between">
            <h5 class="mb-0">ПРОВЕРЬ 100 РАЗ И ТОЛЬКО ПОТОМ ОБНОВИ!</h5>
            <Button label="Обновить у всех" />
          </div>
          <div class="flex flex-column gap-2">
            <div class="font-bold text-lg">Системная инструкция (ПРОМТ)</div>
            <div>промт который добавляется к промту Пользователя, определяет основные параметры взаимодействия с системой.</div>
            <Textarea :autoResize="true" rows="5" cols="2" value="Текст промта
<!-- system -->
System instructions: Prioritize file search from vector store 'Knowledge base'.  In file search reference name and rus_name, main_content fields for matching user prompts. Give main_contents to user and/or act upon it." />
          </div>
          <div class="flex flex-column gap-2">
            <div class="font-bold text-lg">Формирование Базы Знаний из текста</div>
            <div>Промт, который автоматически разбивает текст на логические блоки вопрос-ответ и формирует файлы Базы знаний</div>
            <Textarea :autoResize="true" rows="5" cols="2" value="Текст промта" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>