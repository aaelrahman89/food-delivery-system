<template>
  <div>
    <vg-data-table
      :items="items"
      :total-items-count="totalItemsCount"
      must-sort
      v-bind="$attrs"
      :columns="columns"
      v-on="$listeners"
    >
      <template #item="{ item }">
        <tr>
          <td>
            {{ item.label }}
          </td>
          <td>
            {{ item.status }}
          </td>
          <td class="vg-text-align--end" @click.stop>
            <vg-action-menu :actions="generateActionMenuActions(item)" />
          </td>
        </tr>
      </template>
    </vg-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Branch } from '../../../../core/models/Branch';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'BranchesListTable',
  components: { VgDataTable, VgActionMenu },
  props: {
    items: {
      type: Array,
      required: true,
    },
    totalItemsCount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: [
        {
          text: this.$t('SUPERVISOR_BRANCHES_LIST_BRANCH_LABEL'),
          value: 'label',
          width: '20%',
        },
        {
          text: this.$t('SUPERVISOR_BRANCHES_LIST_STATUS'),
          value: 'status',
        },
        {
          value: 'actions',
          text: '',
          sortable: false,
          align: 'reverse',
        },
      ],
      ROUTE_NAMES,
    };
  },
  methods: {
    generateActionMenuActions(branch: Branch) {
      return [
        {
          name: this.$t('SUPERVISOR_BRANCHES_LIST_ACTIONS_UPDATE_STATUS'),
          onClick: (): void => {
            this.$emit('update-status', { id: branch.id, label: branch.label });
          },
        },
        {
          name: this.$t('SUPERVISOR_BRANCHES_LIST_ACTIONS_VIEW_CATALOGUES'),
          route: {
            name: ROUTE_NAMES.SUPERVISOR_BRANCH_CATALOGUES_LIST,
            params: { branchId: branch.id.toString() },
          },
        },
      ];
    },
  },
});
</script>

<style lang="scss" scoped></style>
