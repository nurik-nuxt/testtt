<script setup lang="ts">
const { t } = useI18n();

const paymentData = ref([
  {
    registrationDate: '17.05.2024',
    id: '3456654',
    email: 'mail@mail.ru',
    paymentAmount: '99$',
    lastPaymentDate: '17.05.2024'
  },
  {
    registrationDate: '17.05.2024',
    id: '3456654',
    email: 'mail@mail.ru',
    paymentAmount: '99$',
    lastPaymentDate: '17.05.2024'
  },
  {
    registrationDate: '17.05.2024',
    id: '3456654',
    email: 'mail@mail.ru',
    paymentAmount: '99$',
    lastPaymentDate: '17.05.2024'
  },
  {
    registrationDate: '17.05.2024',
    id: '3456654',
    email: 'mail@mail.ru',
    paymentAmount: '99$',
    lastPaymentDate: '17.05.2024'
  },
  {
    registrationDate: '17.05.2024',
    id: '3456654',
    email: 'mail@mail.ru',
    paymentAmount: '99$',
    lastPaymentDate: '17.05.2024'
  }
])
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>{{ $t('yourLink') }}</h5>
        <span>{{ $t('clickToCopy') }}</span>
        <div>
          <InputGroup class="mt-2 mb-2">
            <InputText value="https://7sales.ai/register?referral=N4IgTgpgZiBcBsAGATARgMwF8g" readonly class="w-25rem"></InputText>
            <InputGroupAddon>
              <i class="pi pi-copy"></i>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <span>{{ $t('onceClick') }}</span>
        <Divider/>
        <div class="flex w-full flex-column md:flex-row gap-3 mt-4">
          <div class="flex flex-column">
            <h5>{{ $t('promoter') }}:</h5>
            <span>{{ $t('15Promo') }}</span>
          </div>
          <div class="flex flex-column">
            <h5>{{ $t('partner') }}:</h5>
            <span class="mb-2">{{ $t('50Sale') }}</span>
            <div class="flex md:justify-content-start justify-content-center">
              <Button :label="t('becomePartner')" style="max-width: 200px;"/>
            </div>
          </div>
        </div>
        <Divider/>
        <div class="flex flex-column gap-3">
          <span>{{ $t('15Sale') }}</span>
          <div class="flex align-items-center gap-3">
            <Button :label="t('invoiceTheClientForCrm')" severity="secondary" raised style="max-width: 390px;" />
          </div>
        </div>
        <Divider/>
        <div>
          <h5>{{ $t('yourProfit') }}</h5>
          <div class="grid gap-3">
            <div class="profit-card">
              {{ $t('status') }}
              <span class="font-bold">{{ $t('partner') }}</span>
              <span>{{ $t('level') }} 40%</span>
            </div>
            <div class="profit-card">
              {{ $t('7sReferrals') }}
              <span>{{ $t('total') }} 45</span>
              <span>{{ $t('payments') }} 12</span>
              <span>{{ $t('forTheAmountOf') }} 980$</span>
            </div>
            <div class="profit-card">
              {{ $t('crmReferrals') }}
              <span>{{ $t('paid') }} 12</span>
              <span>{{ $t('forTheAmountOf') }} 390$</span>
            </div>
            <div class="profit-card">
              {{ $t('incomeForTheEntirePeriod') }}
              <span class="font-bold">1390 $</span>
            </div>
            <div class="profit-card">
              {{ $t('withdrawnForTheEntirePeriod') }}
              <span class="font-bold">1000 $</span>
            </div>
            <div class="profit-card">
              {{ $t('availableForWithdrawal') }}
              <span class="font-bold">370 $</span>
            </div>
          </div>
          <div class="flex align-items-center gap-3 mt-3">
            <InputText type="text" :placeholder="t('enterAmount')"/>
            <Button :label="t('withdraw')" />
          </div>
        </div>
        <Divider/>
        <div>
          <h5>{{ $t('referrals') }}</h5>
          <DataTable :value="paymentData" tableStyle="min-width: 50rem">
            <Column field="registrationDate" :header="t('registrationDate')"></Column>
            <Column field="id" :header="t('id')"></Column>
            <Column field="email" :header="t('email')"></Column>
            <Column field="paymentAmount" :header="t('paymentAmount')"></Column>
            <Column field="lastPaymentDate" :header="t('lastPaymentDate')"></Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profit-card {
  border: 1px solid var(--surface-border);
  padding: 1rem;
  background: #f1f5f9;
  height: 100px;
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>