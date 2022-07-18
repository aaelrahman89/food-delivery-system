<template>
  <div class="empty-state-container">
    <vg-img
      :src="IMAGE_ORDER_EMPTY_STATE"
      alt="Item cover photo"
      width="30%"
      height="30%"
      object-fit="contain"
    />
    <div class="empty-state-container__first-message">
      {{ $t('ORDER_EMPTY_STATE_MESSAGE_ONE') }}
    </div>
    <div class="empty-state-container__second-message">
      {{ $t('ORDER_EMPTY_STATE_MESSAGE_TWO') }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IMAGE_ORDER_EMPTY_STATE } from '@survv/assets';
import { VgImg } from '@survv/commons/components/VgImg';

export default Vue.extend({
  name: 'OrderEmptyState',
  components: {
    VgImg,
  },
  data() {
    return {
      IMAGE_ORDER_EMPTY_STATE,
    };
  },
});
</script>

<style scoped lang="scss">
.empty-state-container {
  flex: 3;
  display: flex;
  min-width: 400px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--inset-mid);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;

  &__first-message {
    color: var(--color-primary);
    font-weight: bold;
    font-size: var(--font-size-large);
  }
  &__second-message {
    color: #888888;
    font-weight: bold;
    font-size: var(--font-size-large);
  }
}
</style>
