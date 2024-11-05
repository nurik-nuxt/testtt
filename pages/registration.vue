<script setup>
import { useLayout, useApi } from '~/composable';
import { required, helpers, minLength, email } from '@vuelidate/validators';
import useValidate from "@vuelidate/core";
import { useToast } from "primevue/usetoast";


const toast = useToast();
const { t } = useI18n();

const { showLanguageDialog } = useLayout();

const form = reactive({
  email: '',
  name: '',
  phone: '',
  password: null

});

const formRules = computed(() => {
  return {
    email: {
      required: helpers.withMessage(t('required'),required),
      email: helpers.withMessage(t('correctEmail'), email)
    },
    name: {
      required: helpers.withMessage(t('required'), required),
      minLength: helpers.withMessage(t('requiredName'), minLength(3))
    },
    phone: {
      required: helpers.withMessage(t('required'), required),
      minLength: helpers.withMessage(
          t('enterPhoneNumberCorrectly'),
          minLength(18),
      ),
    },
    password: {
      required: helpers.withMessage(t('required'), required),
      minLength: helpers.withMessage(
          t('passwordMinLength'),
          minLength(6),
      ),
    },
  }
});

const v$ = useValidate(formRules, form);



const signIn = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    try {
      const response = await useApi('/auth/register', {
        method: 'POST',
        body: form
      })
      if (response.success) {
        toast.add({ severity: 'success', detail: response?.message, life: 5000 });
        setTimeout(() => {
          return navigateTo({ name: 'login' });
        }, 5000);
      }
      // console.log(response);
      if (response?.error === 'User already registered') {
        toast.add({ severity: 'error', summary: 'Пользователь уже зарегистрирован', detail: response?.message, life: 5000 })
      }
      // if (response?.error) {
      //   toast.add({ severity: 'error', summary: 'Ошибка', detail: response?.message, life: 5000 })
      // }
    } catch (e) {
      console.log(e);
    }
  }
}
definePageMeta({
  layout: 'auth'
})
</script>

<template>
  <Toast />
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center" style="max-width: 450px;">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="flex flex-row-reverse">
            <button class="p-link layout-topbar-button" @click="showLanguageDialog(true)">
              <i style="color: #076AE1; font-size: 1.5rem" class="pi pi-globe"></i>
            </button>
          </div>
          <div class="text-center mb-5">
            <img src="/demo/images/login/logo.png" alt="Image" height="50" class="mb-3" />
            <div class="text-900 text-3xl font-medium mb-3">{{ $t('welcomeText') }}</div>
            <span class="text-600 font-medium">{{ $t('createAccount') }}</span>
          </div>

          <div>
            <div class="mb-5">
              <label for="name" class="block text-900 text-xl font-medium mb-2">{{ $t('name') }}</label>
              <InputText id="name" type="text" :placeholder="t('name')" class="w-full md:w-30rem mb-1" style="padding: 1rem" v-model="form.name" :invalid="v$.$errors.find((el) => el.$property === 'name')?.$message" />
              <span class="mt-1" style="color: #f87171;">{{ v$.$errors.find((el) => el.$property === 'name')?.$message }}</span>
            </div>

            <div class="mb-5">
              <label for="email1" class="block text-900 text-xl font-medium mb-2">{{ $t('email') }}</label>
              <InputText id="email1" type="text" :placeholder="t('emailAddress')" class="w-full md:w-30rem mb-1" style="padding: 1rem" v-model="form.email" :invalid="v$.$errors.find((el) => el.$property === 'email')?.$message" />
              <span class="mt-1" style="color: #f87171;">{{ v$.$errors.find((el) => el.$property === 'email')?.$message }}</span>
            </div>

            <div class="mb-5">
              <label for="email1" class="block text-900 text-xl font-medium mb-2">{{ $t('phone') }}</label>
              <InputMask mask="+9 (999) 999-99-99" id="email1" type="tel" :placeholder="t('phone')" class="w-full md:w-30rem mb-1" style="padding: 1rem" v-model="form.phone" :invalid="v$.$errors.find((el) => el.$property === 'phone')?.$message" />
              <span class="mt-1" style="color: #f87171;">{{ v$.$errors.find((el) => el.$property === 'phone')?.$message }}</span>
            </div>

            <div class="mb-3">
              <label for="password1" class="block text-900 font-medium text-xl mb-2">{{ $t('password') }}</label>
              <Password id="password1" v-model="form.password" :placeholder="t('password')" :toggleMask="true" class="w-full mb-1" inputClass="w-full" :inputStyle="{ padding: '1rem' }" :invalid="v$.$errors.find((el) => el.$property === 'password')?.$message"></Password>
              <span class="mt-1" style="color: #f87171;">{{ v$.$errors.find((el) => el.$property === 'password')?.$message }}</span>
            </div>

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <div class="flex align-items-center justify-content-center text-center">
                  <nuxt-link to="/login" class="text-center" style="color: #076AE1; font-weight: 700">{{ $t('login') }}</nuxt-link>
              </div>
            </div>
            <Button :label="t('registerButton')" class="w-full p-3 text-xl mb-3" @click="signIn"></Button>
            <div>
              <span class="text-600 text-center font-medium">
                {{ $t('loginDescription') }}
                <a href="https://7sales.ai/info" target="_blank">{{ $t('termsOfService') }}</a>
                {{ $t('and') }}
                <a href="https://7sales.ai/privacypolicy" target="_blank">{{ $t('privacyPolicy') }}</a>
                </span>
            </div>
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
