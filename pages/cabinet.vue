<script setup lang="ts">
import jsCookie from 'js-cookie'
import { useAuthStore } from "~/src/shared/store/auth";
import { useUserStore } from "~/src/shared/store/user";
import { thousandSeparator } from "~/src/shared/utils/helpers";


const authStore = useAuthStore();
const userStore = useUserStore();

const opDeleteUser = ref();

const { t } = useI18n();
const user = computed(() => {
  const userCookie = jsCookie.get('user')
  return userCookie ? JSON.parse(userCookie) : null
});

const firstLetterOfName = computed(() => {
  const userCookie = jsCookie.get('user')
  const user = userCookie ? JSON.parse(userCookie) : null
  return user && user.name ? user.name.charAt(0) : ''
})

const oldPassword = ref('')
const newPassword = ref('')
const refreshToken = computed(() => {
  return jsCookie.get('refreshToken')
})
const logout = async () => {
  try {
    const response = await authStore.logout(<string>refreshToken?.value)
    if (response?.success) {
      jsCookie.remove('accessToken');
      jsCookie.remove('refreshToken');
      jsCookie.remove('user');
      return navigateTo({ name: 'login' })
    }
  } catch (e) {
    console.log(e)
  }
}

const visibleDeleteModal1 = ref(false);
const visibleDeleteModal2 = ref(false);
const visibleDeleteModal3 = ref(false);

const openDeleteModal1 = () => {
  visibleDeleteModal1.value = true;
}

const confirmDeleteModal1 = () => {
  visibleDeleteModal1.value = false;
  visibleDeleteModal2.value = true;
}

const confirmDeleteModal2 = () => {
  visibleDeleteModal2.value = false;
  visibleDeleteModal3.value = true;
}

const confirmDeleteModal3 = async () => {
  visibleDeleteModal3.value = false;
  try {
    await authStore.deleteUser().then((res) => {
      if (res.success) {
        jsCookie.remove('accessToken');
        jsCookie.remove('refreshToken');
        jsCookie.remove('user');
        return navigateTo({ name: 'login' })
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const toggleDeleteUser = (event) => {
  opDeleteUser.value.toggle(event)
}

onMounted(async () => {
  await userStore.fetchUserInfo();
})

const inputBalance = ref<number>(0)
const currencyValue = ref<string>('rub')
const currencyList = ref<{ title: string; value: string; diff: number }[]>(
    [
      {
        title: 'Руб',
        value: 'rub',
        diff: 1
      },
      {
        title: 'Тнг',
        value: 'tng',
        diff: 5.5
      },
      {
        title: '$',
        value: 'dollar',
        diff: 0.01
      }
    ]
)

const consumeBalance = async () => {
  await userStore.consumeBalance(inputBalance.value, currencyValue.value).then((res) => {
    window.open(res, '_blank');
  })
}

const formattedBalance = computed(() => {
  const balance = userStore?.user?.balance || 0;
  return balance.toFixed(2).replace('.', ','); // Ensures two decimal places with a comma
});

</script>

<template>
  <Dialog v-model:visible="visibleDeleteModal1" modal :header="t('deleteUser')" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">{{ t('deleteUserConfirm1') }}</span>
    <div class="flex justify-content-center gap-2 w-full">
      <Button type="button" :label="t('yes')" severity="danger" @click="confirmDeleteModal1"></Button>
      <Button type="button" :label="t('cancel')" @click="visibleDeleteModal1 = false"></Button>
    </div>
  </Dialog>

  <Dialog v-model:visible="visibleDeleteModal2" modal :header="t('deleteUser')" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">{{ t('deleteUserConfirm2') }}</span>
    <div class="flex justify-content-center gap-2 w-full">
      <Button type="button" :label="t('yes')" severity="danger" @click="confirmDeleteModal2"></Button>
      <Button type="button" :label="t('cancel')" @click="visibleDeleteModal2 = false"></Button>
    </div>
  </Dialog>

  <Dialog v-model:visible="visibleDeleteModal3" modal :header="t('deleteUser')" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">{{ t('deleteUserConfirm3') }}</span>
    <div class="flex justify-content-center gap-2 w-full">
      <Button type="button" :label="t('delete')" severity="danger" @click="confirmDeleteModal3"></Button>
      <Button type="button" :label="t('cancel')" @click="visibleDeleteModal3 = false"></Button>
    </div>
  </Dialog>
  <OverlayPanel ref="opDeleteUser">
    <div>
      <Button :label="t('deleteFile')" class="p-0 text-left"  style="margin-top: auto; color: #EF4444" link @click="openDeleteModal1" />
    </div>
  </OverlayPanel>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <div class="flex gap-6 balance">
          <div class="user-setting">
            <div class="avatar-wrapper">
              <Avatar :label="firstLetterOfName" class="mr-2" size="xlarge" shape="circle" />
              <div class="profile">
            <span class="flex justify-content-between align-items-center" style="font-weight: 700; font-size: 18px">
              {{ user?.name }}
              <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="toggleDeleteUser">
                <i class="pi pi-ellipsis-h" style="font-size: 18px"></i>
              </button>
            </span>
                <div style="font-weight: 600" class="flex align-items-center gap-5">
                  <span>Баланс:</span>
                  <span>{{ formattedBalance }} Руб</span>
                </div>
                <div class="flex justify-content-between w-full">
                  <Button :label="t('logOut')" class="p-0 text-left"  style="margin-top: auto; color: #076AE1" link @click="logout" />
                  <!--              <Button :label="t('deleteFile')" class="p-0 text-left"  style="margin-top: auto; color: #EF4444" link @click="openDeleteModal1" />-->
                </div>
              </div>
            </div>
            <div class="profile-settings">
              <div>
                <h5 style="font-weight: 700; font-size: 18px">{{ $t('profileInformation') }}</h5>
                <div class="flex flex-column" style="margin-top: 12px">
                  <label for="name-user">{{ $t('name') }}</label>
                  <InputText style="margin-top: 8px; max-width: 450px" c id="name-user" type="text" :value="user?.name" :disabled="true" />
                </div>

                <div class="flex flex-column" style="margin-top: 20px">
                  <label for="name-phone">{{ $t('phone') }}</label>
                  <InputText style="margin-top: 8px; max-width: 450px" c id="name-phone" type="text" :value="user?.phone" :disabled="true" />
                </div>
              </div>

              <div>
                <h5 style="font-weight: 700; font-size: 18px; margin-bottom: 8px">{{ $t('email') }}</h5>
                <span>{{ $t('loginEmail') }}</span>
                <div class="flex flex-column" style="margin-top: 12px">
                  <InputText style="margin-top: 8px; max-width: 450px" c id="email-user" type="text" :value="user?.email" :disabled="true" />
                </div>
              </div>

              <div>
                <h5 style="font-weight: 700; font-size: 18px; margin-bottom: 8px">{{ $t('password') }}</h5>
                <div class="flex flex-column" style="margin-top: 12px">
                  <Password style="max-width: 450px" id="password1" v-model="oldPassword" :placeholder="t('oldPassword')" :toggleMask="true" class="w-full mb-1" inputClass="w-full"></Password>
                  <Password style="max-width: 450px; margin-top: 12px" id="password1" v-model="newPassword" :placeholder="t('newPassword')" :toggleMask="true" class="w-full mb-1" inputClass="w-full"></Password>
                  <Button style="max-width: 150px; margin-top: 12px"  :label="t('save')" class="text-xl mb-3"></Button>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full">
            <div class="flex gap-4 align-items-center mb-4 balance-title">
              <h5 style="font-weight: 700; font-size: 18px; margin-bottom: 0">Пополнить баланс</h5>
<!--              <SelectButton v-model="currencyValue" :options="currencyList" aria-labelledby="basic" option-label="title" option-value="value" :allow-empty="false" />-->
            </div>
            <InputText style="margin-bottom: 16px; width: 100%" id="input-balance" type="number" min="1" v-model="inputBalance" />
            <div v-if="inputBalance > 0" class="flex flex-column gap-2 mb-4">
              <span>{{ inputBalance }} ~ {{ thousandSeparator(inputBalance * currencyList?.find((item) => item.value === 'rub' )?.diff) }} Руб</span>
              <span>{{ inputBalance }} ~ {{ thousandSeparator(inputBalance * currencyList?.find((item) => item.value === 'tng' )?.diff) }} Тнг</span>
              <span>{{ inputBalance }} ~ {{ thousandSeparator(inputBalance * currencyList?.find((item) => item.value === 'dollar' )?.diff) }} $</span>
            </div>
            <Button label="Оплатить" @click="consumeBalance"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-selectbutton .p-button.p-highlight::before) {
  background: #076AE1;
}
:deep(.p-selectbutton .p-button.p-highlight) {
  color: white;
}
.balance {
  @media (max-width: 601px) {
    display: flex;
    flex-direction: column;
    gap: 8px
  }
}

.balance-title {
  @media (max-width: 601px) {
    display: flex;
    flex-direction: column;
    gap: 4px
  }
}

.user-setting {
  width: 70%;
  @media (max-width: 601px) {
    width: 100%
  }
}
</style>