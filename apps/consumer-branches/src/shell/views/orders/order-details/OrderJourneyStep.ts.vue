<template>
  <div class="panel-container">
    <div class="panel-header">
      <vg-flex gap-size="small" align-items="center">
        <div class="panel-title">
          {{ title }}
        </div>
      </vg-flex>
    </div>
    <div class="panel-body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgFlex } from '@survv/commons/components/VgFlex';

export default Vue.extend({
  name: 'OrderJourneyStep',
  components: {
    VgFlex,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
.panel-container {
  width: 100%;
  min-height: 50px;
  position: relative;

  padding: var(--inset-mid);

  display: flex;
  flex-direction: column;

  background-color: var(--color-surface-dark);
  border-radius: 4px;

  .panel-header {
    height: 48px;
    color: var(--color-primary);
    padding: var(--inset-mid);

    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .panel-title-small {
      color: var(--color-on-surface-mid-emphasis);
      font-size: 16px;
      line-height: 20px;
    }
    .panel-title-small.colored {
      color: var(--color-primary);
    }
    .panel-title-large {
      color: var(--color-on-surface-mid-emphasis);
      font-size: 24px;
      line-height: 29px;
    }
    .panel-title-large.colored {
      color: var(--color-primary);
    }
  }

  .panel-body {
    margin-top: calc(48px - var(--inset-mid));
    display: flex;
  }
}
</style>
