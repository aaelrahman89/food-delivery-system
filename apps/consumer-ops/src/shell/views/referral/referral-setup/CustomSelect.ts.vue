<template>
  <div class="custom-select">
    <v-select
      :value="selections"
      :items="items"
      :outlined="outlined"
      :label="label"
      :color="computedColor"
      :rules="validationRules"
      multiple
      @change="selectionChanged($event)"
    >
      <template #prepend-item>
        <v-list-item ripple @click="toggle">
          <v-list-item-action>
            <v-icon :color="selections.length > 0 ? 'black' : ''">{{
              icon
            }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Select All</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>
      <template #item="{ item }">
        <v-icon
          :color="selections.includes(item.valueOf()) ? computedColor : ''"
        >
          {{
            selections.includes(item.valueOf())
              ? 'mdi-checkbox-marked'
              : 'mdi-checkbox-blank-outlined'
          }}
        </v-icon>
        <v-list-item-title>{{ $t(item) }}</v-list-item-title>
      </template>
      <template #selection="{ item }">
        <v-list-item-title>{{ $t(item) }}</v-list-item-title>
      </template>
    </v-select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const events = {
  updateSelections: 'update:selections',
};
export default Vue.extend({
  name: 'CustomSelect',
  props: {
    label: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary',
    },
    translatable: {
      type: Boolean,
      default: true,
    },
    validator: {
      type: Function,
      default: undefined,
    },
    selections: {
      type: Array,
      default(): [] {
        return [];
      },
    },
  },
  data() {
    return {
      selectedItems: [],
    };
  },
  computed: {
    selectsAllItems(): boolean {
      return this.selectedItems.length === this.items.length;
    },
    selectsSomeItems(): boolean {
      return this.selectedItems.length > 0 && !this.selectsAllItems;
    },
    icon(): string {
      if (this.selectsAllItems) return 'mdi-checkbox-marked';
      if (this.selectsSomeItems) return 'mdi-minus-box';
      return 'mdi-checkbox-blank-outlined';
    },
    computedColor(): string {
      if (this.color === 'primary') return 'vg-red';
      return this.color;
    },
    validationRules(): undefined | (string | true)[] {
      if (this.validator) {
        const validationResult = this.validator();
        if (validationResult === true) return [true];
        return [this.$t(validationResult)];
      }
      return undefined;
    },
  },

  methods: {
    toggle(): void {
      this.$nextTick(() => {
        if (this.selectsAllItems) {
          this.selectedItems = [];
        } else {
          this.selectedItems = this.items.slice();
        }
      });
    },
    selectionChanged(selections: unknown): void {
      this.selectedItems = selections;
      this.$emit(events.updateSelections, selections);
    },
  },
});
</script>
<style scoped></style>
