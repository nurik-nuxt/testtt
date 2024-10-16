<script setup>
import { useLayout } from '~/composable';
import { useAuthStore } from "~/src/shared/store/auth";
import { helpers, minLength, required, email } from "@vuelidate/validators";
import useValidate from "@vuelidate/core";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const { t } = useI18n();


const { showLanguageDialog } = useLayout();
const authStore = useAuthStore();
const password = ref('');
const checked = ref(false);

const form = reactive({
  email: '',
  password: null

});

const formRules = computed(() => {
  return {
    email: {
      required: helpers.withMessage(t('required'),required),
      email: helpers.withMessage(t('correctEmail'), email)
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

const login = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    try {
      const response = await authStore.login(form);
      if (response?.access_token) {
        if (response?.user?.role === 'admin') {
          return navigateTo({ name: 'admin-dashboard' })
        }
        if (response?.user?.role === 'support') {
          return navigateTo({ name: 'supports-chatbots' })
        } else {
          return navigateTo({ name: 'channels' })
        }
      }
      if (response?.error) {
        toast.add({ severity: 'error', summary: t('error'), detail: response?.error, life: 5000 })
      }
      if (response?.error === 'Please verify your email before logging in.') {
        toast.add({ severity: 'error', summary: 'Ошибка', detail: response?.advice, life: 5000 })
      }
    } catch (e) {
      console.log(e)
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
            <span class="text-600 font-medium">{{ $t('logInToContinue') }}</span>
          </div>

          <div>
            <div class="mb-5">
              <label for="email1" class="block text-900 text-xl font-medium mb-2">{{ $t('email') }}</label>
              <InputText id="email1" type="text" :placeholder="t('emailAddress')" class="w-full md:w-30rem mb-1" style="padding: 1rem" v-model="form.email" :invalid="v$.$errors.find((el) => el.$property === 'email')?.$message" />
              <span class="mt-1" style="color: #f87171;">{{ v$.$errors.find((el) => el.$property === 'email')?.$message }}</span>
            </div>

            <div class="mb-3">
              <label for="password1" class="block text-900 font-medium text-xl mb-2">{{ $t('password') }}</label>
              <Password id="password1" v-model="form.password" :placeholder="t('password')" :toggleMask="true" class="w-full mb-1" inputClass="w-full" :inputStyle="{ padding: '1rem' }" :invalid="v$.$errors.find((el) => el.$property === 'password')?.$message"></Password>
              <span class="mt-1" style="color: #f87171;">{{ v$.$errors.find((el) => el.$property === 'password')?.$message }}</span>
            </div>

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <div class="flex align-items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">{{ $t('rememberMe') }}</label>
              </div>
              <nuxt-link to="/reset-password" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">{{ $t('forgotPassword') }}?</nuxt-link>
            </div>
            <Button :label="t('login')" class="w-full p-3 text-xl mb-3" @click="login"></Button>
            <div class="flex justify-content-center">
              <nuxt-link to="/registration" style="color: #076AE1; font-weight: 700">{{ $t('registerButton') }}</nuxt-link>
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
