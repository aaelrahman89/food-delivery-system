<template>
  <div class="vg-app-bar">
    <div class="vg-app-bar__start">
      <div
        v-allowed-roles="[
          UserRole.CALL_CENTER_SUPER_ADMIN,
          UserRole.CALL_CENTER_SUPERVISOR,
        ]"
        class="vg-app-bar__start__icon-container"
      >
        <vg-button icon flat @click="toggleMenu">
          <vg-svg
            :src="shiftBackIcon"
            class="vg-app-bar__start__shift-back"
            :class="shiftBackIconClasses"
            fill="var(--color-on-surface-low-emphasis)"
          ></vg-svg>
        </vg-button>
      </div>
      <div class="vendor-details-container">
        <router-link :to="{ name: commonRouteNames.HOME }">
          <div class="vendor-details-container__logo">
            <img alt="logo" class="vg-app-bar__start__logo" :src="logoUrl" />
          </div>
        </router-link>
        <div class="vg-app-bar__start__label">
          {{ vendorLabel }}
        </div>
      </div>
    </div>
    <div class="vg-app-bar__middle">
      <slot></slot>
    </div>
    <div class="vg-app-bar__end">
      <h4>{{ userName }}</h4>
      <app-bar-action-menu :actions="generateActionMenuActions()" />
    </div>
  </div>
</template>

<script lang="ts">
import AppBarActionMenu from './AppBarActionMenu.ts.vue';
import Vue from 'vue';
import { ActionMenuItem } from '@survv/commons/core/models/ActionMenu';
import {
  AssetExport,
  SVG_GLOBAL_ARROW_DOWN,
  SVG_GLOBAL_LOCALIZATION,
  SVG_GLOBAL_LOGOUT,
  SVG_NAVIGATION_BURGER_LTR,
  SVG_NAVIGATION_BURGER_RTL,
} from '@survv/assets';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { commonRouteNames } from '@survv/commons/core/routes/routes';

const events = {
  toggleMenu: 'toggle:menu',
  switchLanguage: 'switch:language',
  signOut: 'signOut',
};

export default Vue.extend({
  name: 'CallCenterAppBar',
  components: {
    AppBarActionMenu,
    VgSvg,
    VgButton,
  },
  props: {
    logoUrl: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    vendorLabel: {
      type: String,
      required: true,
    },
    collapsed: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      commonRouteNames,
      SVG_GLOBAL_ARROW_DOWN,
      UserRole,
    };
  },
  computed: {
    shiftBackIcon(): AssetExport {
      if (this.$rtl) {
        return SVG_NAVIGATION_BURGER_RTL;
      }
      return SVG_NAVIGATION_BURGER_LTR;
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
    generateActionMenuActions(): ActionMenuItem[] {
      return [
        {
          name: this.$t('BUTTON_LABEL_LANGUAGE_SWITCH'),
          onClick: (): void => {
            this.$emit(events.switchLanguage);
          },
          icon: SVG_GLOBAL_LOCALIZATION,
        },
        {
          name: this.$t('BUTTON_LABEL_SIGN_OUT'),
          onClick: (): void => {
            this.$emit(events.signOut);
          },
          icon: SVG_GLOBAL_LOGOUT,
        },
      ];
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
  flex-flow: row nowrap;
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
    &__label {
      font-weight: 500;
      font-size: var(--font-size-large);
    }
    &__logo {
      width: 36px;
      height: 36px;
      object-fit: cover;
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
    @media (max-width: 600px) {
      &__text {
        display: none;
      }
    }
  }
}
.vendor-details-container {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: var(--inset-small);

  &__logo {
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
  }
}
</style>
