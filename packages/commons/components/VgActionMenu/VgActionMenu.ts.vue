<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        :outlined="outlined"
        :style="actionMenuButtonStyle"
        text
        v-on="on"
      >
        <svg
          id="kebab-menu-icon"
          :style="actionMenuIconStyle"
          enable-background="new 0 0 24 24"
          version="1.0"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </v-btn>
    </template>
    <v-list class="menu__actions-list">
      <template v-for="(action, index) in actions">
        <v-list-item
          v-if="action.route"
          :key="index"
          :to="action.route"
          :disabled="action.disabled"
        >
          <v-list-item-content>
            <v-list-item-title class="text-caption">
              {{ action.name }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="action.icon">
            <slot name="icon" :icon="action.icon"></slot>
          </v-list-item-action>
        </v-list-item>

        <v-list-item
          v-if="action.onClick"
          :key="index"
          :disabled="action.disabled"
          @click="action.onClick"
        >
          <v-list-item-content>
            <v-list-item-title class="text-caption">
              {{ action.name }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="action.icon">
            <slot name="icon" :icon="action.icon"></slot>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { ActionMenuItem } from '../../core/models/ActionMenu';

export default Vue.extend({
  name: 'VgActionMenu',
  props: {
    actions: {
      type: Array,
      default(): ActionMenuItem[] {
        return [];
      },
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    actionMenuButtonStyle(): Record<string, string | undefined> {
      return {
        color: this.color === 'primary' ? 'var(--color-primary)' : this.color,
        borderRadius: this.outlined ? '4px' : undefined,
        borderColor:
          this.color === 'primary' ? 'var(--color-primary)' : this.color,
      };
    },
    actionMenuIconStyle(): Record<string, string> {
      return {
        fill: this.color === 'primary' ? 'var(--color-primary)' : this.color,
      };
    },
  },
});
</script>

<style scoped>
#kebab-menu-icon {
  width: 24px;
  height: 24px;
}
</style>
