<template>
  <div class="vg-app-menu" :class="containerClasses">
    <div class="vg-app-menu__body">
      <div
        v-for="(section, sectionIndex) in menu"
        :key="sectionIndex"
        class="vg-app-menu__section"
      >
        <div
          v-if="section.header && !collapsed"
          class="vg-app-menu__section-header"
          :class="sectionHeaderClasses"
        >
          {{ $t(section.header) }}
        </div>
        <router-link
          v-for="(entry, entryIndex) in section.entries"
          :key="entryIndex"
          v-slot="{ href, route, navigate, isActive, isExactActive }"
          :to="entry.route"
        >
          <a
            :href="href"
            class="vg-app-menu__entry"
            :class="getMenuEntryClasses({ isActive, isExactActive, route })"
            @click="navigate"
          >
            <div class="vg-app-menu__entry__icon">
              <vg-svg
                :src="entry.icon"
                :fill="getIconClass({ isActive, isExactActive, route })"
                width="24px"
                height="24px"
              ></vg-svg>
            </div>
            <div
              class="vg-text--ellipsis vg-app-menu__entry__name"
              :class="entryNameClasses"
            >
              {{ $t(entry.name) }}
            </div>
          </a>
        </router-link>
      </div>
      <div v-if="!collapsed">
        <slot name="body-footer"></slot>
      </div>
    </div>
    <div class="vg-app-menu__footer">
      <vg-flex flex-direction="column" no-wrap gap-size="mid">
        <div v-if="!collapsed">
          <slot name="menu-footer"></slot>
        </div>
      </vg-flex>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { AppMenuSection } from '@survv/commons/core/models/AppMenu';
import { Location } from 'vue-router';
import { PropValidator } from 'vue/types/options';
import { SVG_GLOBAL_LOGOUT } from '@survv/assets';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgSvg } from '@survv/commons/components/VgSvg';

const events = {
  signOut: 'sign-out',
};

export default Vue.extend({
  name: 'VgAppMenu',
  components: {
    VgSvg,
    VgFlex,
  },
  props: {
    menu: {
      type: Array,
      required: true,
    } as PropValidator<AppMenuSection[]>,
    collapsed: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      signOutIcon: SVG_GLOBAL_LOGOUT,
      signOutSvgProps: { height: '100%', fill: '#ffffff' },
    };
  },
  computed: {
    containerClasses(): Record<string, boolean> {
      return {
        'vg-app-menu--collapsed': this.collapsed,
      };
    },
    entryNameClasses(): Record<string, boolean> {
      return {
        'vg-app-menu__entry__name--collapsed': this.collapsed,
      };
    },
    sectionHeaderClasses(): Record<string, boolean> {
      return {
        'vg-app-menu__section-header--collapsed': this.collapsed,
      };
    },
    signOutTextClasses(): Record<string, boolean> {
      return {
        'vg-app-menu__sign-out__text--collapsed': this.collapsed,
      };
    },
  },
  methods: {
    getIconClass(args: {
      isActive: boolean;
      isExactActive: boolean;
      route: Location;
    }): string {
      const { isActive, isExactActive, route } = args;
      let active = isActive;
      if (route.path == '/') {
        active = isActive && isExactActive;
      }
      return active
        ? 'var(--color-primary)'
        : 'var(--color-on-surface-low-emphasis)';
    },
    getMenuEntryClasses(args: {
      isActive: boolean;
      isExactActive: boolean;
      route: Location;
    }): Record<string, boolean> {
      const { isActive, isExactActive, route } = args;
      let active = isActive;
      if (route.path == '/') {
        active = isActive && isExactActive;
      }
      return {
        'vg-app-menu__entry--active': active,
      };
    },
    onSignOut(): void {
      this.$emit(events.signOut);
    },
  },
});
</script>

<style scoped lang="scss">
.vg-app-menu {
  height: 100%;
  width: 256px;
  background: var(--color-surface-dark);
  border-inline-end: 1px solid var(--color-border-light);
  transition: width var(--shell-transition) cubic-bezier(0.41, 0.38, 0.16, 1);
  display: flex;
  flex-flow: column nowrap;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--inset-small);

  &--collapsed {
    width: 80px;
  }
  &__body {
    overflow: auto;
  }

  &__section {
    margin-top: var(--inset-small);
  }

  &__section-header {
    padding: var(--inset-small);
    font-size: var(--font-size-small);
    color: var(--color-on-surface-low-emphasis);
    &--collapsed {
      padding: 0;
      font-size: 0;
      height: 0;
      border-top: 1px solid var(--color-border-light);
      margin: var(--inset-small) 0;
    }
  }

  &__entry {
    color: inherit;
    text-decoration: none;
    display: flex;
    flex-flow: row nowrap;
    padding: var(--inset-small);
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    &__name {
      margin-inline-start: 32px;
      flex-grow: 1;
      font-size: var(--font-size-mid);
      &--collapsed {
        display: none;
      }
    }
    &__icon {
      flex-shrink: 1;
    }
    &:hover,
    &--active {
      background: var(--color-primary-dim);
    }
    &--active {
      color: var(--color-primary);
    }
  }

  &__entry + &__entry {
    margin-top: var(--inset-small);
  }
  &__footer {
    padding: var(--inset-small) 0;
    display: flex;
    justify-content: center;
  }
  &__sign-out {
    display: flex;
    align-items: center;
    justify-content: center;
    &__text {
      margin-inline-end: var(--inset-small);
      &--collapsed {
        display: none;
      }
    }
  }
}
</style>
