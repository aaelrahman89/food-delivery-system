<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ROUTE_NAMES } from '../../core/routes/routeNames';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';

export default Vue.extend({
  name: 'Redirect',
  async created(): Promise<void> {
    const userRoles = await authTokenRepo.getUserRoles();

    if (
      userRoles.some((role) => role.equals(UserRole.CALL_CENTER_SUPERVISOR)) ||
      userRoles.some((role) => role.equals(UserRole.CALL_CENTER_SUPER_ADMIN))
    ) {
      await this.$router.push({
        name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST,
      });
    } else if (
      userRoles.some((role) => role.equals(UserRole.CALL_CENTER_AGENT))
    ) {
      await this.$router.push({
        name: ROUTE_NAMES.AGENT_ORDER_EMPTY,
      });
    }
  },
});
</script>

<style scoped lang="scss"></style>
