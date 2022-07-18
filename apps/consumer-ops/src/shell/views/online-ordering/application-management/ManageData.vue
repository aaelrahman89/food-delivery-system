<template>
  <vg-panel :title="$t('APP_MANAGEMENT_MANAGE_DATA')">
    <div class="tags">
      <router-link v-for="tag in tags" :key="tag.title" :to="tag.route">
        <div class="tags__item">
          <div class="tags__item__icon">
            <vg-svg :src="tag.icon" />
          </div>
          <div class="tags__item__title">{{ $t(tag.title) }}</div>
        </div>
      </router-link>
    </div>
  </vg-panel>
</template>
<script>
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSvg } from '@survv/commons/components/VgSvg';

export default {
  name: 'ManageData',
  components: { VgPanel, VgSvg },
  props: {
    tags: {
      type: Array,
      required: true,
    },
  },
};
</script>
<style scoped lang="scss">
.tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: calc(var(--inset-large) * -1);
}

.tags__item {
  height: 150px;
  width: 200px;
  min-width: 200px;
  background-color: #f2f2f2;
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  margin-inline-end: var(--inset-mid);
  margin-bottom: var(--inset-large);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tags__item__title {
  text-align: center;
  color: rgba(0, 0, 0, 0.78);
  font-size: 16px;
  line-height: 19px;
}

.tags__item__icon {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
