<template>
  <v-alert class="balance-at-risk-alert" color="warning">
    <h4 class="vg-darkgrey--text">
      {{ $t('VENDOR_BALANCE_AT_RISK_MSG') }}
    </h4>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BalanceAtRiskAlert',
});
</script>

<style scoped lang="scss">
.balance-at-risk-alert {
  margin: 0;
}
</style>
