<template>
  <div class="vg-app-bar">
    <div class="vg-app-bar__start">
      <div class="vg-app-bar__start__icon-container">
        <vg-button icon flat @click="toggleMenu">
          <vg-svg
            :src="shiftBackIcon"
            class="vg-app-bar__start__shift-back"
            :class="shiftBackIconClasses"
            fill="var(--color-on-surface-low-emphasis)"
          ></vg-svg>
        </vg-button>
      </div>
      <div style="height: 48px">
        <router-link :to="{ name: commonRouteNames.HOME }">
          <img height="48px" :src="logoUrl" />
        </router-link>
      </div>
    </div>
    <div class="vg-app-bar__middle">
      <slot></slot>
    </div>
    <div class="vg-app-bar__end">
      <vg-button
        outlined
        class="vg-app-bar__language-switcher"
        :icon="$vuetify.breakpoint.xs"
        @click="switchLanguage"
      >
        <div class="vg-app-bar__language-switcher__text">
          {{ $t('BUTTON_LABEL_LANGUAGE_SWITCH') }}
        </div>
        <vg-svg
          :src="languageSwitcherIcon"
          fill="var(--color-primary)"
        ></vg-svg>
      </vg-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  AssetExport,
  SVG_GLOBAL_LOCALIZATION,
  SVG_GLOBAL_SHIFT_BACK_LTR,
  SVG_GLOBAL_SHIFT_BACK_RTL,
} from '@survv/assets';
import { VgButton } from '../VgButton';
import { VgSvg } from '../VgSvg';
import { commonRouteNames } from '../../core/routes/routes';

const events = {
  toggleMenu: 'toggle:menu',
  switchLanguage: 'switch:language',
};

export default Vue.extend({
  name: 'VgAppBar',
  components: {
    VgSvg,
    VgButton,
  },
  props: {
    collapsed: {
      type: Boolean,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      commonRouteNames,
      languageSwitcherIcon: SVG_GLOBAL_LOCALIZATION,
    };
  },
  computed: {
    shiftBackIcon(): AssetExport {
      if (this.$rtl) {
        return SVG_GLOBAL_SHIFT_BACK_RTL;
      }
      return SVG_GLOBAL_SHIFT_BACK_LTR;
    },
    shiftBackIconClasses(): Record<string, boolean> {
      return {
        'vg-app-bar__start__shift-back--collapsed': this.collapsed,
      };
    },
  },
  methods: {
    toggleMenu(): void {
      this.$emit(events.toggleMenu);
    },
    switchLanguage(): void {
      this.$emit(events.switchLanguage);
    },
  },
});
</script>

<style scoped lang="scss">
.vg-app-bar {
  position: relative;
  height: var(--size-app-bar);
  width: 100%;
  background: var(--color-surface-light);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: var(--inset-small);

  &__start,
  &__end {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  &__start {
    justify-content: flex-end;
    flex-grow: 0;
    &__icon-container {
      width: 48px;
      height: 48px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
    }
    &__shift-back {
      transition: transform var(--shell-transition)
        cubic-bezier(0.41, 0.38, 0.16, 1);
      &--collapsed {
        transform: rotate(180deg);
      }
      html[dir='rtl'] &--collapsed {
        transform: rotate(-180deg);
      }
    }
  }
  &__middle {
    flex-grow: 1;
  }

  &__end {
    justify-content: flex-start;
    flex-grow: 0;
    margin-inline-end: var(--inset-small);
  }

  &__language-switcher {
    display: flex;
    align-items: center;
    justify-content: center;
    &__text {
      margin-inline-end: var(--inset-small);
    }
    @media (max-width: 1000px) {
      &__text {
        display: none;
      }
    }
  }
}

@media (max-width: 600px) {
  .vg-app-bar {
    height: auto;
  }
}
</style>
