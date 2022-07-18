<template>
  <div class="VgTextArea">
    <v-textarea
      filled
      :value="value"
      :label="computedLabel"
      :rows="rowsCount"
      :readonly="readonly"
      :disabled="disabled"
      :outlined="outlined"
      :no-resize="!resizable"
      :clearable="clearable"
      :rules="validationRules"
      color="primary"
      :hint="hint"
      :persistent-hint="persistentHint"
      @input="inputValue"
    >
    </v-textarea>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const events = {
  input: 'input',
};

export default Vue.extend({
  name: 'VgTextarea',
  props: {
    value: { type: undefined, required: true },
    label: { type: String, required: true },
    rowsCount: { type: [String, Number], default: 5 }, // vuetify-default
    required: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    resizable: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    validator: { type: Function, default: undefined },
    hint: { type: String, default: undefined },
    persistentHint: { type: Boolean, default: false },
  },
  computed: {
    computedLabel(): string {
      if (this.required) return `${this.$t(this.label)}*`;
      return this.$t(this.label);
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
    inputValue($event: string): void {
      this.$emit(events.input, $event);
    },
  },
});
</script>

<style scoped></style>
