<script setup>
import { useLayout } from '~/composable';

const { layoutConfig } = useLayout();
const email = ref('');
const password = ref('');
const checked = ref(false);
const name = ref('');

const logoUrl = computed(() => {
  return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <img src="/demo/images/login/logo.png" alt="Image" height="50" class="mb-3" />
            <div class="text-900 text-3xl font-medium mb-3">Добро пожаловать на 7sales.pro!</div>
          </div>

          <div>
            <label for="name" class="block text-900 text-xl font-medium mb-2">Имя</label>
            <InputText id="name" type="text" placeholder="Ваше имя" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="name" />

            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
            <InputText id="email1" type="text" placeholder="Адрес электронной почты" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Пароль</label>
            <Password id="password1" v-model="password" placeholder="Пароль" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <div class="flex align-items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">Запомнить меня</label>
              </div>
            </div>
            <Button label="Зарегистрироваться" class="w-full p-3 text-xl"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
