<template>
  <vg-actionable-panel>
    <template #header>
      <div class="app-management__header">
        <div>
          <h1 class="app-management__header__title">
            {{ $t('APP_MANAGEMENT_HOMEPAGE') }}
          </h1>
        </div>
        <div>
          <vg-button outlined large color="primary" :to="sectionsEditRoute"
            >{{ $t('APP_MANAGEMENT_UPDATE_HOMEPAGE') }}
          </vg-button>
        </div>
      </div>
    </template>
    <vg-panel
      v-for="section in sections"
      :key="section.id"
      :title="section.name"
      :dark="true"
      class="section"
    >
      <vg-pairs-list :pairs="section.pairs"></vg-pairs-list>
    </vg-panel>
  </vg-actionable-panel>
</template>
<script>
import { VgActionablePanel } from '@survv/commons/components/VgActionablePanel';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgPairsList } from '@survv/commons/components-deprecated/VgPairs';
import { VgPanel } from '@survv/commons/components/VgPanel';

export default {
  name: 'HomepageSectionsView',
  components: {
    VgActionablePanel,
    VgButton,
    VgPairsList,
    VgPanel,
  },
  props: {
    sections: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    sectionsEditRoute() {
      return {
        name: 'routes.online_ordering.application.sections.edit',
        params: this.$route.params,
      };
    },
  },
};
</script>
<style scoped lang="scss">
.app-management__header {
  font-size: medium;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.app-management__header__title {
  color: #000000;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
}

.section:not(:first-child) {
  margin-top: var(--inset-small);
}
</style>
