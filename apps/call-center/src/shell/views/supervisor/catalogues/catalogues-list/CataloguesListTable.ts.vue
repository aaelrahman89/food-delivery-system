<template>
  <vg-data-table
    v-bind="$attrs"
    :columns="columns"
    hide-footer
    v-on="$listeners"
  >
    <template #item="{ item }">
      <tr>
        <td>{{ $t(item.displayName.en) }}</td>
        <td>{{ $t(item.displayName.ar) }}</td>
        <td class="vg-text-align--center">
          <vg-button :to="getCatalogueRoute(item)">{{
            $t('MISC_SHOW_DETAILS')
          }}</vg-button>
        </td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { CataloguesListItem } from '../../../../../core/models/Catalogue';
import { Location } from 'vue-router';
import { ROUTE_NAMES } from '../../../../../core/routes/routeNames';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

export default Vue.extend({
  name: 'CataloguesListTable',
  components: { VgDataTable, VgButton },
  data() {
    return {
      columns: [
        {
          value: 'displayName.en',
          text: this.$t('CATALOGUE_TABLE_HEADER_ENGLISH'),
          sortable: false,
        },
        {
          value: 'displayName.ar',
          text: this.$t('CATALOGUE_TABLE_HEADER_ARABIC'),
          sortable: false,
        },
        {
          value: '',
          text: '',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    getCatalogueRoute(catalogue: CataloguesListItem): Location {
      return {
        name: ROUTE_NAMES.SUPERVISOR_BRANCH_CATALOGUE_DETAILS,
        params: {
          branchId: this.$route.params.branchId,
          catalogueId: String(catalogue.id),
        },
      };
    },
  },
});
</script>

<style scoped></style>
