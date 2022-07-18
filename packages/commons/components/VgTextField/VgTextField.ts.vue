<template>
  <div class="vg-text-field">
    <v-text-field
      :background-color="backgroundColor"
      :value="value"
      :type="type"
      :outlined="outlined"
      :clearable="clearable"
      :readonly="readonly"
      :disabled="disabled"
      :label="computedLabel"
      :hint="hint"
      :persistent-hint="persistentHint"
      color="primary"
      :hide-details="hideDetails"
      :rules="validationRules"
      :style="style"
      v-bind="$attrs"
      @input="inputValue"
    >
      <template #append>
        <slot name="append"> </slot>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const events = {
  input: 'input',
};
export default Vue.extend({
  name: 'VgTextField',
  props: {
    value: {
      type: undefined,
      default: undefined,
    },
    type: {
      type: String,
      required: true,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    validator: {
      type: Function,
      default: undefined,
    },
    label: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: undefined,
    },
    required: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: '240px',
    },
    width: {
      type: String,
      default: undefined,
    },
    hint: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    computedLabel(): string {
      if (this.required) return `${this.$t(this.label)}*`;
      return this.$t(this.label);
    },
    persistentHint(): boolean {
      return Boolean(this.hint);
    },
    validationRules(): undefined | (string | true)[] {
      if (this.validator) {
        const validationResult = this.validator();
        if (validationResult === true) return [true];
        return [this.$t(validationResult)];
      }
      return undefined;
    },
    style(): Partial<CSSStyleDeclaration> {
      return {
        maxWidth: this.maxWidth,
        width: this.width,
      };
    },
  },
  methods: {
    inputValue($event: string): void {
      this.$emit(events.input, $event);
    },
  },
});
</script>

<style scoped></style>
