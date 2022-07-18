<template>
  <vg-panel :title="$t('TAGS')">
    <vg-flex gap-size="small">
      <vg-chip v-for="tag in vendor.tags" :key="tag.id" :img="tag.icon">
        {{ $t(tag.name) }}
      </vg-chip>
    </vg-flex>
  </vg-panel>
</template>

<script>
import { VendorOnlineProfile } from '../../../../core/models/VendorOnlineProfile';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPanel } from '@survv/commons/components/VgPanel';

export default {
  name: 'VendorOnlineProfileTags',
  components: { VgPanel, VgChip, VgFlex },
  props: {
    vendor: {
      type: VendorOnlineProfile,
      default: undefined,
    },
  },
};
</script>

<style scoped></style>
