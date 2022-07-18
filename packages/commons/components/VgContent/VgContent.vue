<template>
  <div class="vg-content">
    <template>
      <div v-if="showHeader" class="vg-content__header">
        <component
          :is="header"
          :breadcrumbs="breadcrumbs"
          :title="title"
        ></component>
      </div>
      <div class="vg-content__body">
        <slot></slot>
      </div>
    </template>
  </div>
</template>

<script>
import VgContentBreadcrumbs from './VgContentBreadcrumbs.vue';
import VgContentTitle from './VgContentTitle.vue';
import { VgProgressCircular } from '../VgProgressCircular';
import { isNotEmpty } from '../../core/utils/checks';

const headers = {
  TITLE: VgContentTitle,
  BREADCRUMBS: VgContentBreadcrumbs,
};

export default {
  name: 'VgContent',
  components: {
    VgProgressCircular,
  },
  props: {
    noHeader: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: undefined,
    },
    breadcrumbs: {
      type: Array,
      default: undefined,
    },
    pm: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    header() {
      if (this.breadcrumbs?.length > 1) {
        return headers.BREADCRUMBS;
      }
      return headers.TITLE;
    },
    showHeader() {
      return !this.noHeader;
    },
  },
  watch: {
    'pm.query': async function queryWatcher(value) {
      const newQuery = JSON.stringify(value);
      if (newQuery != this.$route.query.q) {
        await this.$router.push({
          query: {
            q: newQuery,
          },
        });
      }
    },
  },
  async destroyed() {
    if (isNotEmpty(this.pm)) {
      await this.pm.onViewDestroyed();
    }
  },
};
</script>

<style scoped lang="scss">
.vg-content {
  padding: var(--inset-mid);

  &__header {
    margin-bottom: var(--inset-small);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    min-height: 58px;
  }

  &__progress-loader {
    width: 100%;
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
