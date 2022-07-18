<template>
  <div class="vg-app-shell">
    <call-center-app-bar
      class="vg-app-shell__bar"
      :logo-url="logoUrl"
      :user-name="userName"
      :vendor-label="vendorLabel"
      :collapsed="collapsedMenu"
      @toggle:menu="setCollapsedMenu"
      @switch:language="onLanguageSwitch"
      @signOut="onSignOut"
    >
      <slot name="app-bar"></slot>
    </call-center-app-bar>
    <main>
      <vg-app-menu
        v-allowed-roles="[
          UserRole.CALL_CENTER_SUPER_ADMIN,
          UserRole.CALL_CENTER_SUPERVISOR,
        ]"
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
import CallCenterAppBar from './CallCenterAppBar.ts.vue';
import VgAppMenu from './VgAppMenu.ts.vue';
import Vue from 'vue';
import { AppMenuSection } from '@survv/commons/core/models/AppMenu';
import { PropValidator } from 'vue/types/options';
import { UserRole } from '@survv/commons/core/models/UserRole';

const events = {
  signOut: 'sign-out',
  switchLanguage: 'switch:language',
};

export default Vue.extend({
  name: 'CallCenterAppShell',
  components: {
    CallCenterAppBar,
    VgAppMenu,
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
    menu: {
      type: Array,
      required: true,
    } as PropValidator<AppMenuSection[]>,
  },
  data() {
    return {
      collapsedMenu: false,
      UserRole,
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
