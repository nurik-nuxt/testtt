<script setup lang="ts">
import { useDashboardStore } from "~/src/shared/store/dashboard";
import { thousandSeparator } from "~/src/shared/utils/helpers";
import { useDashboardBalanceStore } from "~/src/shared/store/dashboard/balance";

const dashboardStore = useDashboardStore();
const dashboardBalanceStore = useDashboardBalanceStore();

onMounted(async () => {
  await Promise.all([
    dashboardStore.loadUserStatistics(),
    dashboardStore.loadBotsStatistics(),
    dashboardStore.loadLeadsStatistics(),
    dashboardStore.loadTariffStatistics(),
    dashboardStore.loadTariffStatisticsSums(),
    dashboardStore.loadUsersTariffPayCount(),
    dashboardBalanceStore.loadBalanceStatistics()
  ])
})

const userStatistics = computed(() => {
  return dashboardStore.getUserStatistics
})
const botsStatistics = computed(() => {
  return dashboardStore.getBotsStatistics
})
const leadsStatistics = computed(() => {
  return dashboardStore.getLeadsStatistics
})
const tariffStatistics = computed(() => {
  return dashboardStore.getTariffStatistics
})
const tariffStatisticsSums = computed(() => {
  return dashboardStore.getTariffStatisticsSums
})
const sumsLoading = computed(() => {
  return dashboardStore.getLoadingTariffStatisticsSums
})
const paidUsersCount = computed(() => {
  return dashboardStore.getPaidUsersCount
})
const paidUsersCountLoading = computed(() => {
  return dashboardStore.getLoadingPaidUsersCount
})

const balanceToday = computed(() => {
  return dashboardBalanceStore.getTodaySum
})

const balanceMonth = computed(() => {
  return dashboardBalanceStore.getMonthSum
})

const balanceYear = computed(() => {
  return dashboardBalanceStore.getYearSum
})
</script>

<template>
  <div class="dashboard">
    <div class="section general">
      <h2>Общие показатели</h2>
      <ul>
        <li>Всего пользователей: <span class="font-bold ml-2">{{ userStatistics?.totalUsers }}</span></li>
        <li>Всего ии-ботов: <span class="font-bold ml-2">{{ botsStatistics?.totalBots }}</span></li>
        <li>Активные боты: <span class="font-bold ml-2">{{ botsStatistics?.activeBots }}</span></li>
        <li>Всего диалогов с клиентами: <span class="font-bold ml-2">{{ leadsStatistics?.totalLeadsCount }}</span></li>
        <li>Сгенерировано сообщений всего: <span class="font-bold ml-2">{{ leadsStatistics?.totalAssistantMessagesCount }}</span></li>
      </ul>
    </div>

    <div class="section growth">
      <h2>Развитие</h2>
      <ul>
        <li>Новых пользователей за сегодня: <span class="font-bold ml-2">{{ userStatistics?.newUsersToday }}</span></li>
        <li>Новых пользователей за месяц: <span class="font-bold ml-2">{{ userStatistics?.newUsersThisMonth }}</span></li>
        <li>Новых пользователей за год: <span class="font-bold ml-2">{{ userStatistics?.newUsersThisYear }}</span></li>
      </ul>
    </div>

    <div class="section financial">
      <h2>Финансовые</h2>
      <ul>
        <li>Оплат за сегодня: <span class="font-bold ml-2">{{ tariffStatistics.newUsersToday }}
          <ProgressSpinner v-if="sumsLoading" style="width: 20px; height: 20px"  />
          <span v-else>( {{ thousandSeparator(tariffStatisticsSums.newUsersToday) }} рублей)</span>
        </span></li>
        <li>Оплат за текущий месяц: <span class="font-bold ml-2">{{ tariffStatistics.newUsersThisMonth }}
          <ProgressSpinner v-if="sumsLoading" style="width: 20px; height: 20px"  />
          <span v-else>( {{ thousandSeparator(tariffStatisticsSums.newUsersThisMonth) }} рублей)</span>
        </span></li>
        <li>Оплат с начала года: <span class="font-bold ml-2">{{ tariffStatistics.newUsersThisYear }}
          <ProgressSpinner v-if="sumsLoading" style="width: 20px; height: 20px"  />
          <span v-else>( {{ thousandSeparator(tariffStatisticsSums.newUsersThisYear) }} рублей)</span>
        </span></li>
        <li>Пользователей которые оплатили: <span class="font-bold ml-2">
          <ProgressSpinner v-if="paidUsersCountLoading" style="width: 20px; height: 20px"  />
          <span v-else>{{ paidUsersCount }}</span>
        </span></li>
      </ul>
    </div>

    <div class="section functional">
      <h2>Функциональные</h2>
      <ul>
        <li>Количество обращений в тех. поддержку посл. 10 дней</li>
        <li>NPS</li>
      </ul>
    </div>

    <div class="section technical">
      <h2>Внутерные токены</h2>
      <ul>
        <li>Оплат за сегодня: <span class="font-bold ml-2">
          <span>{{ thousandSeparator(balanceToday) }} рублей</span>
<!--          <ProgressSpinner v-if="balanceToday" style="width: 20px; height: 20px"  />-->
<!--          <span v-else>( {{ thousandSeparator(balanceToday) }} рублей)</span>-->
        </span></li>
        <li>Оплат за текущий месяц: <span class="font-bold ml-2">
          <span>{{ thousandSeparator(balanceMonth) }} рублей</span>
<!--          <ProgressSpinner v-if="balanceMonth" style="width: 20px; height: 20px"  />-->
<!--          <span v-else>( {{ thousandSeparator(tariffStatisticsSums.newUsersThisMonth) }} рублей)</span>-->
        </span></li>
        <li>Оплат с начала года: <span class="font-bold ml-2">
          <span>{{ thousandSeparator(balanceYear) }} рублей</span>
<!--          <ProgressSpinner v-if="sumsLoading" style="width: 20px; height: 20px"  />-->
<!--          <span v-else>( {{ thousandSeparator(tariffStatisticsSums.newUsersThisYear) }} рублей)</span>-->
        </span></li>
<!--        <li>Пользователей которые оплатили: <span class="font-bold ml-2">-->
<!--          <ProgressSpinner v-if="paidUsersCountLoading" style="width: 20px; height: 20px"  />-->
<!--          <span v-else>{{ paidUsersCount }}</span>-->
<!--        </span></li>-->
      </ul>
<!--      <h2>Технические</h2>-->
<!--      <ul>-->
<!--        <li>Нагрузка на серверы?</li>-->
<!--        <li>Отказы?</li>-->
<!--      </ul>-->
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 20px;
  padding: 20px;
}

.section {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 15px;
  font-size: 1.2em;
  color: #333;
}

.section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section ul li {
  margin-bottom: 10px;
  font-size: 1em;
  color: #555;
}

.general {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.growth {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.financial {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.functional {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

.technical {
  grid-column: 3 / 4;
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
