<template>
  <div class="vg-app-shell">
    <vg-app-bar
      class="vg-app-shell__bar"
      :collapsed="collapsedMenu"
      :logo-url="logoUrl"
      @toggle:menu="setCollapsedMenu"
      @switch:language="onLanguageSwitch"
    >
      <slot name="app-bar"></slot>
    </vg-app-bar>
    <main>
      <vg-app-menu
        class="vg-app-shell__menu"
        :menu="menu"
        :collapsed="collapsedMenu"
        @sign-out="onSignOut"
      >
        <template #body-footer>
          <slot name="body-footer"></slot>
        </template>
        <template #menu-footer>
          <slot name="menu-footer"></slot>
        </template>
      </vg-app-menu>
      <div class="vg-app-shell__body">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import VgAppBar from './VgAppBar.ts.vue';
import VgAppMenu from './VgAppMenu.ts.vue';
import Vue from 'vue';
import { AppMenuSection } from '../../core/models/AppMenu';
import { PropValidator } from 'vue/types/options';

const events = {
  signOut: 'sign-out',
  switchLanguage: 'switch:language',
};

export default Vue.extend({
  name: 'VgAppShell',
  components: {
    VgAppBar,
    VgAppMenu,
  },
  props: {
    menu: {
      type: Array,
      required: true,
    } as PropValidator<AppMenuSection[]>,
    logoUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      collapsedMenu: false,
    };
  },
  created() {
    if (window.innerWidth < window.innerHeight) {
      this.collapsedMenu = true;
    }
  },
  methods: {
    setCollapsedMenu(): void {
      this.collapsedMenu = !this.collapsedMenu;
    },
    onSignOut(): void {
      this.$emit(events.signOut);
    },
    onLanguageSwitch(): void {
      this.$emit(events.switchLanguage);
    },
  },
});
</script>

<style scoped lang="scss">
.vg-app-shell {
  width: 100%;
  height: 100vh;
  background-color: var(--color-surface-light);

  &__body {
    height: 100%;
    width: 100%;
    overflow: auto;
    overflow-y: scroll;
  }

  &__menu {
    flex-shrink: 0;
  }

  main {
    display: flex;
    flex-flow: row nowrap;
    height: calc(100vh - var(--size-app-bar));
  }
}
</style>
