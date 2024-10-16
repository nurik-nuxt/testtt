<!--<script setup lang="ts">-->
<!--import jsCookie from 'js-cookie'-->
<!--import { useAuthStore } from "~/src/shared/store/auth";-->
<!--const authStore = useAuthStore();-->

<!--const { t } = useI18n();-->
<!--const user = computed(() => {-->
<!--  const userCookie = jsCookie.get('user')-->
<!--  return userCookie ? JSON.parse(userCookie) : null-->
<!--});-->

<!--const firstLetterOfName = computed(() => {-->
<!--  const userCookie = jsCookie.get('user')-->
<!--  const user = userCookie ? JSON.parse(userCookie) : null-->
<!--  return user && user.name ? user.name.charAt(0) : ''-->
<!--})-->

<!--const oldPassword = ref('')-->
<!--const newPassword = ref('')-->
<!--const refreshToken = computed(() => {-->
<!--  return jsCookie.get('refreshToken')-->
<!--})-->
<!--const logout = async () => {-->
<!--  try {-->
<!--    const response = await authStore.logout(<string>refreshToken?.value)-->
<!--    console.log(response);-->
<!--    if (response?.success) {-->
<!--      jsCookie.remove('accessToken');-->
<!--      jsCookie.remove('refreshToken');-->
<!--      jsCookie.remove('user');-->
<!--      return navigateTo({ name: 'login' })-->
<!--    }-->
<!--  } catch (e) {-->
<!--    console.log(e)-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <div class="grid">-->
<!--    <div class="col-12">-->
<!--      <div class="card h-full">-->
<!--        <div class="avatar-wrapper">-->
<!--          <Avatar :label="firstLetterOfName" class="mr-2" size="xlarge" shape="circle" />-->
<!--          <div class="profile">-->
<!--            <span style="font-weight: 700; font-size: 18px">{{ user?.name }}</span>-->
<!--            <span>{{ $t('administrator') }}</span>-->
<!--            <Button :label="t('logOut')" class="p-0 text-left"  style="margin-top: auto; color: #076AE1" link @click="logout" />-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="profile-settings">-->
<!--          <div>-->
<!--            <h5 style="font-weight: 700; font-size: 18px">{{ $t('profileInformation') }}</h5>-->
<!--            <div class="flex flex-column" style="margin-top: 12px">-->
<!--              <label for="name-user">{{ $t('name') }}</label>-->
<!--              <InputText style="margin-top: 8px; max-width: 450px" c id="name-user" type="text" :value="user?.name" :disabled="true" />-->
<!--            </div>-->

<!--            <div class="flex flex-column" style="margin-top: 20px">-->
<!--              <label for="name-phone">{{ $t('phone') }}</label>-->
<!--              <InputText style="margin-top: 8px; max-width: 450px" c id="name-phone" type="text" :value="user?.phone" :disabled="true" />-->
<!--            </div>-->
<!--          </div>-->

<!--          <div>-->
<!--            <h5 style="font-weight: 700; font-size: 18px; margin-bottom: 8px">{{ $t('email') }}</h5>-->
<!--            <span>{{ $t('loginEmail') }}</span>-->
<!--            <div class="flex flex-column" style="margin-top: 12px">-->
<!--              <InputText style="margin-top: 8px; max-width: 450px" c id="email-user" type="text" :value="user?.email" :disabled="true" />-->
<!--            </div>-->
<!--          </div>-->

<!--          <div>-->
<!--            <h5 style="font-weight: 700; font-size: 18px; margin-bottom: 8px">{{ $t('password') }}</h5>-->
<!--            <div class="flex flex-column" style="margin-top: 12px">-->
<!--              <Password style="max-width: 450px" id="password1" v-model="oldPassword" :placeholder="t('oldPassword')" :toggleMask="true" class="w-full mb-1" inputClass="w-full"></Password>-->
<!--              <Password style="max-width: 450px; margin-top: 12px" id="password1" v-model="newPassword" :placeholder="t('newPassword')" :toggleMask="true" class="w-full mb-1" inputClass="w-full"></Password>-->
<!--              <Button style="max-width: 150px; margin-top: 12px"  :label="t('save')" class="text-xl mb-3"></Button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<script setup lang="ts">
import jsCookie from 'js-cookie';

// const user = jsCookie.get('supportUser');
const userName = computed(() => {
  return jsCookie.get('supportName')
})

const userPhone = computed(() => {
  return jsCookie.get('supportPhone')
})

const userEmail = computed(() => {
  return jsCookie.get('supportedUserEmail')
})
</script>


<template>
  <div class="grid">
    <div class="col-12">
      <div v-if="userEmail" class="card h-full">
        <div class="flex flex-column gap-4">
          <div><span style="font-weight: 700;">Имя</span>: <span class="ml-2">{{ userName }}</span></div>
          <div><span style="font-weight: 700;">Телефон</span>: <span class="ml-2">{{ userPhone }}</span></div>
          <div><span style="font-weight: 700;">Email</span>: <span class="ml-2">{{ userEmail }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
