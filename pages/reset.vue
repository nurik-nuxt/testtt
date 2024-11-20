<script setup lang="ts">
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

const route = useRoute();

const form = reactive({
  password: '',

});

const formRules = computed(() => {
  return {
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

const submitPassword = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    await authStore.confirmPassword(form.password, route?.query?.token).then((res) => {
      if (res.success) {
        toast.add({ severity: 'success', summary: 'Успешно', detail:res?.message, life: 5000 });
      } else {
        toast.add({ severity: 'error', summary: 'Успешно', detail:res?.message, life: 5000 });
      }
    })
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
          </div>

          <div>
            <div class="mb-5">
              <label for="email1" class="block text-900 text-xl font-medium mb-2">Придумай новый пароль</label>
              <InputText id="email1" type="text" placeholder="Пароль" class="w-full md:w-30rem mb-1" style="padding: 1rem" v-model="form.password" :invalid="v$.$errors.find((el) => el.$property === 'password')?.$message" />
              <span class="mt-1" style="color: #f87171;">{{ v$.$errors.find((el) => el.$property === 'password')?.$message }}</span>
            </div>

            <Button :label="t('sendButtonPassword')" class="w-full p-3 text-xl mb-3" @click="submitPassword"></Button>
            <div class="flex justify-content-center">
              <nuxt-link to="/login" style="color: #076AE1; font-weight: 700">{{ $t('login') }}</nuxt-link>
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
