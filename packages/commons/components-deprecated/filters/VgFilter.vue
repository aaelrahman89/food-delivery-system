<template>
  <vg-panel :title="$t('FILTERS')" collapsible class="filters">
    <template>
      <div class="filters-body">
        <slot></slot>
      </div>
      <div class="divider"><hr /></div>
      <div class="filters-actions">
        <slot name="actions"></slot>
      </div>
    </template>
  </vg-panel>
</template>

<script>
import { VgPanel } from '../../components/VgPanel';

export default {
  name: 'VgFilter',
  components: { VgPanel },
};
</script>

<style scoped>
.filters {
  width: 100%;
  min-width: 260px;
}
.filters-body {
  margin-inline-start: calc(-1 * var(--inset-small));
  margin-top: calc(-1 * var(--inset-small));
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;

  padding: 0 7px;
}
.divider {
  padding: 12px;
}
.filters-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
