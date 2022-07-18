<template>
  <div class="description">
    <vg-panel :title="$t('DESCRIPTION')" collapsible>
      <p>
        {{ $t(vendor.description) }}
      </p>
    </vg-panel>
  </div>
</template>

<script>
import { VendorOnlineProfile } from '../../../../core/models/VendorOnlineProfile';
import { VgPanel } from '@survv/commons/components/VgPanel';

export default {
  name: 'VendorOnlineProfileDescription',
  components: { VgPanel },
  props: {
    vendor: {
      type: VendorOnlineProfile,
      default: undefined,
    },
  },
};
</script>

<style scoped lang="scss">
p {
  color: var(--color-on-surface-low-emphasis);
}
</style>
