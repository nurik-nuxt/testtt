<script setup lang="ts">
import { AppMenuItem } from "~/src/shared/components/app-menu-item";
import { useAuthStore } from "~/src/shared/store/auth";
import jsCookie from "js-cookie";
import { useClipboard } from '@vueuse/core';
import { useToast } from "primevue/usetoast";


const toast = useToast();
const authStore = useAuthStore();
const { t } = useI18n();
const { copy } = useClipboard();

const copyToClipboard = async () => {
  await copy(<string>authStore?.userData?._id).then(() => {
    toast.add({ severity: 'success', summary: t('successClipboard'), life: 5000 });

  });
}
interface MenuItem {
  label: string;
  url: string;
  icon: string;
}
const menu = computed(() => {
  return [
    {
      label: t('channels'),
      icon: 'pi pi-fw pi-sitemap',
      url: 'channels'
    },
    {
      label: t('chatbots'),
      icon: 'pi pi-fw pi-android',
      url: 'chatbots'
    },
    {
      label: t('message'),
      icon: 'pi pi-fw pi-comment',
      url: 'dialogues'
    },
    {
      label: t('tariff'),
      icon: 'pi pi-fw pi-star',
      url: 'tariffs'
    },
    // {
    //   label: t('subscription'),
    //   icon: 'pi pi-fw pi-qrcode',
    //   url: 'subscriptions'
    // },
    {
      label: t('callAnalytics'),
      icon: 'pi pi-fw pi-chart-pie',
      url: 'analytics'
    },
    {
      label: t('logs'),
      icon: 'pi pi-fw pi-prime',
      url: 'logs'
    },
    // {
    //   label: t('partnerAccount'),
    //   icon: 'pi pi-fw pi-id-card',
    //   url: 'partner-cabinet'
    // },
    {
      label: t('profile'),
      icon: 'pi pi-fw pi-user',
      url: 'cabinet'
    },
    {
      label: t('help'),
      icon: 'pi pi-fw pi-question-circle',
      url: 'support'
    },
    {
      label: 'Регистрация',
      icon: 'pi pi-fw pi-user',
      url: 'registration'
    },
  ]
})
const menuSupport = computed(() => {
  return [
    {
      label: t('chatbots'),
      icon: 'pi pi-fw pi-android',
      url: 'chatbots'
    },
    {
      label: t('tariff'),
      icon: 'pi pi-fw pi-star',
      url: 'supports/tariffs'
    },
    // {
    //   label: t('message'),
    //   icon: 'pi pi-fw pi-comment',
    //   url: 'supports/dialogues'
    // },
    {
      label: t('callAnalytics'),
      icon: 'pi pi-fw pi-chart-pie',
      url: 'supports/analytics'
    },
    // {
    //   label: t('logs'),
    //   icon: 'pi pi-fw pi-prime',
    //   url: 'supports/logs'
    // },
    // {
    //   label: t('partnerAccount'),
    //   icon: 'pi pi-fw pi-id-card',
    //   url: 'supports/partner-cabinet'
    // },
    {
      label: t('profile'),
      icon: 'pi pi-fw pi-user',
      url: 'supports/cabinet'
    },
    // {
    //   label: t('hiddenSettings'),
    //   icon: 'pi pi-fw pi-cog',
    //   url: 'supports/settings'
    // },
  ]
})
const menuAdmin = computed(() => {
  return [
    {
      label: 'Дашборд 7s',
      icon: 'pi pi-fw pi-home',
      url: 'admin/dashboard'
    },
    {
      label: t('systemPromts'),
      icon: 'pi pi-fw pi-star',
      url: 'admin/products'
    },
    {
      label: 'Уведомление',
      icon: 'pi pi-fw pi-bell',
      url: 'admin/notification'
    },
    {
      label: 'База знаний',
      icon: 'pi pi-fw pi-database',
      url: 'admin/knowledge'
    },
    // {
    //   label: 'Логи',
    //   icon: 'pi pi-fw pi-prime',
    //   url: 'admin/logs'
    // },
    // {
    //   label: 'Настройки ...',
    //   icon: 'pi pi-fw pi-cog',
    //   url: 'admin/settings'
    // },
    // {
    //   label: 'Пользователи',
    //   icon: 'pi pi-fw pi-users',
    //   url: 'admin/users'
    // },
    {
      label: 'Пользователи',
      icon: 'pi pi-fw pi-users',
      url: 'admin/tariffs'
    },
    {
      label: 'Внутерные токены',
      icon: 'pi pi-fw pi-users',
      url: 'admin/tokens'
    }
  ]
})
const op = ref();

const toggle = (event) => {
  op.value.toggle(event);
}

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
      jsCookie.remove('supportAccessToken');
      jsCookie.remove('supportRefreshToken');
      jsCookie.remove('supportedUser');
      return navigateTo({ name: 'login' })
    }
  } catch (e) {
    console.log(e)
  }
}

const goTelegramChannelNews = () => {
  window.open('https://t.me/news7sales', '_blank');
}

const becomePartner = () => {
  window.open('https://7sales.ai/partners', '_blank');
}

const becomeInvestor = () => {
  window.open('https://t.me/kozzloff', '_blank');
}

const goSupportOperatorChat = () => {
  window.open('https://t.me/+YjHVwEmFHEEzNGYy', '_blank');
}


</script>

<template>
  <ul class="layout-menu">
    <template v-if="authStore.isSupport">
      <template v-for="(item, i) in menuSupport" :key="i">
        <app-menu-item :icon="item.icon" :label="item.label" :url="item.url" />
      </template>
      <div class="logout mt-auto flex flex-column gap-1">
        <span>Support: {{ authStore?.userData?.email}}</span>
        <Button class="p-0 text-left"  style="margin-top: auto; color: #076AE1" :label="t('logOut')" link @click="logout"/>
      </div>
    </template>
    <template v-else-if="authStore.isAdmin">
      <template v-for="(item, i) in menuAdmin" :key="i">
        <app-menu-item :icon="item.icon" :label="item.label" :url="item.url" />
      </template>
      <div class="logout mt-auto flex flex-column gap-1">
        <span>Support: {{ authStore?.userData?.email}}</span>
        <Button class="p-0 text-left"  style="margin-top: auto; color: #076AE1" :label="t('logOut')" link @click="logout"/>
      </div>
    </template>
    <template v-else>
<!--      <pre>{{ menu }}</pre>-->
      <template v-for="(item, i) in menu.slice(0,6)" :key="i">
        <app-menu-item :icon="item.icon" :label="item.label" :url="item.url" />
      </template>
      <div style="margin-top: auto;">
        <template v-for="(item, i) in menu.slice(6,7)" :key="i">
          <app-menu-item :icon="item.icon" :label="item.label" :url="item.url" />
        </template>
        <span class="help-btn" @click="toggle">
        <i class="pi pi-fw pi-question-circle" style="margin-right: 0.5rem;"></i>
        {{ $t('help')}}
      </span>
        <OverlayPanel ref="op" style="background: #CDDFFF;">
          <div class="flex flex-column gap-2 w-25rem">
            <div>
              <span class="font-medium text-900 block mb-2">{{ $t('yourId') }}</span>
              <InputGroup class="mb-2">
                <InputText :value="authStore?.userData?._id" readonly class="w-25rem"></InputText>
                <InputGroupAddon>
                  <i class="pi pi-copy" style="cursor: pointer" @click="copyToClipboard"></i>
                </InputGroupAddon>
              </InputGroup>
              <span>{{ $t('contactingSupport') }}</span>
              <Divider />
            </div>
            <div class="flex flex-column gap-2">
              <div class="font-bold">{{ $t('connectWithUs') }}</div>
              <span @click="goSupportOperatorChat" class="flex align-items-center gap-1 cursor-pointer guide-item">
              <i class="pi pi-fw pi-question-circle"></i>
              {{ $t('supportOperatorChat') }}
            </span>
              <span class="flex align-items-center gap-1 cursor-pointer guide-item">
              <i class="pi pi-fw pi-users"></i>
              {{ $t('partnerSupportChat') }}
            </span>
            </div>
            <Divider />
            <div class="flex flex-column gap-2">
              <div class="font-bold">{{ $t('usefulMaterials') }}</div>
              <span class="flex align-items-center gap-1 cursor-pointer guide-item">
              <i class="pi pi-fw pi-database"></i>
              {{ $t('knowledgeBase') }}
            </span>
            <span @click="goTelegramChannelNews" class="flex align-items-center gap-1 cursor-pointer guide-item">
              <i class="pi pi-fw pi-telegram"></i>
              {{ $t('telegramChannelNews') }}
            </span>
              <span @click="becomePartner" class="flex align-items-center gap-1 cursor-pointer guide-item">
              <i class="pi pi-fw pi-user-plus"></i>
              {{ $t('becomePartner') }}
            </span>
              <span @click="becomeInvestor" class="flex align-items-center gap-1 cursor-pointer guide-item">
              <i class="pi pi-fw pi-dollar"></i>
                Инвесторам
<!--              {{ $t('becomePartner') }}-->
            </span>
            </div>
          </div>
        </OverlayPanel>
      </div>
    </template>
  </ul>
</template>

<style scoped>
.help-btn {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}
:deep(.p-divider.p-divider-horizontal:before) {
  border-top: 1px solid black;
}
.logout {
  padding: 0.75rem 1rem;
}

.guide-item:hover {
  font-weight: 700
}
</style>
