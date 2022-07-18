<template>
  <vg-data-table
    :columns="columns"
    v-bind="$attrs"
    hide-footer
    v-on="$listeners"
  >
    <template #item="{ item }">
      <tr>
        <td>
          {{ item.displayName.en }}
        </td>
        <td>
          {{ item.displayName.ar }}
        </td>
        <td>
          {{ item.percentage }}
        </td>
        <td>
          <vg-button flat icon @click="updateTier(item.id)">
            <vg-svg :src="SVG_GLOBAL_EDIT" width="24px" height="24px"></vg-svg>
          </vg-button>
        </td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { EntityId } from '@survv/commons/core/types';
import { SVG_GLOBAL_EDIT } from '@survv/assets';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgDataTable } from '@survv/commons/components/VgDataTable';
import { VgSvg } from '@survv/commons/components/VgSvg';

const events = {
  updateTier: 'update:tier',
};

export default Vue.extend({
  name: 'TaxTiersTable',
  components: { VgDataTable, VgButton, VgSvg },
  data() {
    return {
      columns: [
        {
          value: 'displayName.en',
          text: this.$t('TAX_TIER_TABLE_ENGLISH_NAME'),
          sortable: true,
        },
        {
          value: 'displayName.ar',
          text: this.$t('TAX_TIER_TABLE_ARABIC_NAME'),
          sortable: true,
        },
        {
          value: 'percentage',
          text: this.$t('TAX_TIER_TABLE_PERCENTAGE'),
          sortable: true,
        },
        {
          value: '',
          text: '',
          sortable: false,
          align: 'reverse',
        },
      ],
      SVG_GLOBAL_EDIT,
    };
  },
  methods: {
    updateTier(tierId: EntityId): void {
      this.$emit(events.updateTier, tierId);
    },
  },
});
</script>

<style scoped lang="scss"></style>
