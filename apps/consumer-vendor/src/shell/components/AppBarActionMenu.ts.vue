<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon :outlined="outlined" :style="actionMenuButtonStyle" v-on="on">
        <vg-svg :src="SVG_GLOBAL_CARET_DOWN"></vg-svg>
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
            <v-list-item-title>
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
          <v-list-item-action v-if="action.icon">
            <vg-svg height="100%" width="100%" :src="action.icon"></vg-svg>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ action.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { ActionMenuItem } from '@survv/commons/core/models/ActionMenu';
import { SVG_GLOBAL_CARET_DOWN } from '@survv/assets';
import { VgSvg } from '@survv/commons/components/VgSvg';

export default Vue.extend({
  name: 'AppBarActionMenu',
  components: {
    VgSvg,
  },
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
  data() {
    return {
      SVG_GLOBAL_CARET_DOWN,
    };
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

<style scoped></style>
