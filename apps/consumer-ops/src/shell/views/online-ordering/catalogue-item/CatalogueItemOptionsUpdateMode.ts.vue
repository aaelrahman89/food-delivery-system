<template>
  <vg-grid class="vg-border vg-padding--mid">
    <vg-flex justify-content="space-between">
      <div>
        <vg-button outlined large @click="switchToOptionsViewMode">{{
          $t('CATALOGUE_ITEM_OPTIONS_UPDATE_DISCARD')
        }}</vg-button>
      </div>
      <div>
        <vg-button :to="catalogueItemOptionsRoute" outlined large>
          <vg-flex
            gap-size="small"
            align-items="center"
            justify-content="center"
            no-wrap
            ><div>
              <svg viewBox="0 0 448 448" class="add-button__icon">
                <path
                  d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"
                />
              </svg>
            </div>
            <div>
              {{ $t('CATALOGUE_ITEM_OPTIONS_ADD') }}
            </div>
          </vg-flex>
        </vg-button>
      </div>
    </vg-flex>
    <div class="vg-border vg-border--dashed"></div>
    <vg-grid
      v-for="option in options"
      :key="option.id"
      gap-size="small"
      class="option-card vg-padding--mid vg-border"
    >
      <vg-flex align-items="center" justify-content="space-between">
        <div class="option-card__title">
          {{ addRequiredPrefix(option) }}
        </div>
        <vg-action-menu :actions="getOptionActions(option)"></vg-action-menu>
      </vg-flex>
      <vg-flex gap-size="small">
        <vg-chip>
          {{
            $t('CATALOGUE_ITEM_OPTIONS_SELECTIONS', {
              selectionsCount: option.selections.length,
            })
          }}
        </vg-chip>
        <vg-chip>
          {{ selectionsLimit(option) }}
        </vg-chip>
      </vg-flex>
    </vg-grid>
  </vg-grid>
</template>

<script lang="ts">
import Vue from 'vue';
import { ActionMenuItem } from '@survv/commons/core/models/ActionMenu';
import { CatalogueItemOption } from '../../../../core/models/CatalogueItemOption';
import { Location } from 'vue-router';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGrid } from '@survv/commons/components/VgGrid';

const events = {
  switchOptionsView: 'switch:options-view',
  deleteOption: 'delete:option',
};

export default Vue.extend({
  name: 'CatalogueItemOptionsUpdateMode',
  components: {
    VgFlex,
    VgChip,
    VgButton,
    VgGrid,
    VgActionMenu,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  computed: {
    catalogueItemOptionsRoute(): Location {
      return {
        name: 'routes.online_ordering.options.create',
        params: { ...this.$route.params },
      };
    },
  },
  methods: {
    switchToOptionsViewMode(): void {
      this.$emit(events.switchOptionsView);
    },
    getOptionActions(option: CatalogueItemOption): ActionMenuItem[] {
      return [
        {
          name: this.$t('CATALOGUE_ITEM_OPTION_UPDATE_NAVIGATION'),
          route: {
            name: 'routes.online_ordering.options.edit',
            params: { ...this.$route.params, optionId: String(option.id) },
          },
        },
        {
          name: this.$t('CATALOGUE_ITEM_OPTION_DELETE_NAVIGATION'),
          onClick: (): void => {
            this.$emit(events.deleteOption, option.id);
          },
        },
      ];
    },
    addRequiredPrefix(option: CatalogueItemOption): string {
      if (option.mandatory)
        return `${this.$t(option.displayName)} (${this.$t('MISC_REQUIRED')})`;
      return this.$t(option.displayName);
    },
    selectionsLimit(option: CatalogueItemOption): string {
      if (option.multiSelection)
        return this.$t('CATALOGUE_ITEM_OPTIONS_SELECTIONS_LIMIT_MULTI', {
          min: option.minAllowed,
          max: option.maxAllowed,
        });
      return this.$t('CATALOGUE_ITEM_OPTIONS_SELECTIONS_LIMIT_SINGLE');
    },
  },
});
</script>

<style scoped lang="scss">
.option-card {
  background-color: var(--color-surface-dark);
  &__title {
    font-size: 16px;
  }
}
.add-button__icon {
  width: 12px;
  height: 12px;
  fill: var(--color-primary);
}
</style>
