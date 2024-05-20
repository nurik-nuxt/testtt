<script setup>
import { useLayout } from '~/composable';

const { layoutConfig, showLanguageDialog } = useLayout();
const email = ref('');
const password = ref('');
const checked = ref(false);
const name = ref('');
const phone = ref('');

const logoUrl = computed(() => {
  return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const signIn = () => {
  return navigateTo({ name: 'index' })
}
definePageMeta({
  layout: 'auth'
})
const { t } = useI18n();

</script>

<template>
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
            <label for="name" class="block text-900 text-xl font-medium mb-2">{{ $t('name') }}</label>
            <InputText id="name" type="text" :placeholder="t('name')" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="name" />

            <label for="email1" class="block text-900 text-xl font-medium mb-2">{{ $t('email') }}</label>
            <InputText id="email1" type="text" :placeholder="t('emailAddress')" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

            <label for="email1" class="block text-900 text-xl font-medium mb-2">{{ $t('phone') }}</label>
            <InputText id="email1" type="text" :placeholder="t('phone')" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="phone" />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">{{ $t('password') }}</label>
            <Password id="password1" v-model="password" :placeholder="t('password')" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <div class="flex align-items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">{{ $t('rememberMe') }}</label>
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
