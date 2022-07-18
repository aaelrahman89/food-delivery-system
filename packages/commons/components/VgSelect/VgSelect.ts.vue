<template>
  <div class="vg-select">
    <v-autocomplete
      :color="computedColor"
      :value="mappedSelection"
      :items="mappedOptions"
      :outlined="outlined"
      :solo="solo"
      :loading="loading"
      :rules="validationRules"
      :label="mappedLabel"
      :disabled="disabled"
      item-value="value"
      :readonly="readonly"
      :multiple="multiple"
      :hide-details="hideDetails"
      :clearable="clearable"
      :style="style"
      @change="selectionChanged($event)"
      @click="click"
    >
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { FormSelectionOption } from '../../core/forms/selection';
import { deepEqual } from '../../core/utils/checks';

interface VuetifySelectionItem {
  text: string;
  value: unknown;
}

const events = {
  updateSelection: 'update:selection',
  updateItems: 'update:items',
  click: 'click',
};

export default Vue.extend({
  name: 'VgSelect',
  props: {
    options: {
      type: Array,
      required: true,
    },
    selection: {
      type: undefined,
      default: undefined,
    },
    color: {
      type: String,
      default: 'primary',
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    solo: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: undefined,
    },
    validator: {
      type: Function,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: '240px',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
    translatable: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    computedColor(): string {
      if (this.color === 'primary') return 'vg-red';
      return this.color;
    },
    style(): Partial<CSSStyleDeclaration> {
      return {
        maxWidth: this.maxWidth,
        width: this.width,
      };
    },
    mappedOptions(): VuetifySelectionItem[] {
      return (this.options as FormSelectionOption<unknown>[]).map((option) => ({
        text: this.translatable
          ? this.$t(option.label)
          : option.label.toString(),
        value: option.value,
      }));
    },
    validationRules(): string[] | boolean[] | undefined {
      if (!this.validator) {
        return undefined;
      }

      const validationResult = this.validator();
      if (validationResult === true) {
        return [true];
      }
      return [this.$t(validationResult)];
    },
    mappedLabel(): string {
      if (this.required) {
        return `${this.$t(this.label)}*`;
      }
      return this.$t(this.label);
    },
    mappedSelection():
      | VuetifySelectionItem
      | VuetifySelectionItem[]
      | undefined {
      if (this.multiple) {
        return this.mappedOptions.filter((option) =>
          this.selection?.find((selection) =>
            deepEqual(option.value, selection)
          )
        );
      }
      return this.mappedOptions.find((option) =>
        deepEqual(option.value, this.selection)
      );
    },
  },
  methods: {
    selectionChanged(selection: string): void {
      this.$emit(events.updateSelection, selection);
    },
    click(): void {
      this.$emit(events.click);
    },
  },
});
</script>

<style scoped></style>
