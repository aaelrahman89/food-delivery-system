<template>
  <div class="global-alert vg-padding--large">
    <vg-flex gap-size="large" align-items="stretch" no-wrap>
      <vg-svg :src="SVG_ICON_NOTIFICATIONS" class="global-alert__icon"></vg-svg>
      <div class="global-alert__body">
        <span>
          {{ $t('NOTIFICATION_PERMISSION_ALERT_MESSAGE_PART_1') }}
          <span class="vg-text--bold">
            {{ $t('NOTIFICATION_PERMISSION_ALERT_MESSAGE_PART_2') }}
          </span>
          {{ $t('NOTIFICATION_PERMISSION_ALERT_MESSAGE_PART_3') }}
        </span>
      </div>
      <div class="global-alert__actions">
        <vg-button @click="apply">{{
          $t('NOTIFICATION_PERMISSION_ALERT_APPLY_BUTTON_LABEL')
        }}</vg-button>
      </div>
    </vg-flex>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SVG_ICON_NOTIFICATIONS } from '@survv/assets';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgSvg } from '@survv/commons/components/VgSvg';

const events = {
  apply: 'apply',
};
export default Vue.extend({
  name: 'NotificationPermissionAlert',
  components: {
    VgFlex,
    VgButton,
    VgSvg,
  },
  data() {
    return {
      SVG_ICON_NOTIFICATIONS,
    };
  },
  methods: {
    apply(): void {
      this.$emit(events.apply);
    },
  },
});
</script>

<style scoped lang="scss">
.global-alert {
  background-color: rgba(224, 32, 32, 0.2);
  color: #e74854;
  &__icon {
    background-color: var(--color-primary);
    width: 60px;
    height: 60px;
    border-radius: 30px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__body {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
  &__actions {
    display: flex;
    align-items: center;
  }
}
</style>
