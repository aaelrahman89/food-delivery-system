<template>
  <v-text-field
    slot="activator"
    :ref="'ctrl'"
    v-model="internalValue"
    :type="options.inputType"
    :label="title"
  />
</template>

<script>
export default {
  name: 'VgInput',
  props: {
    name: {
      type: String,
      default: '',
    },
    defaultValue: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default() {
        return { title: '', placeholder: '', inputType: 'text' };
      },
    },
  },
  data() {
    return {
      internalValue: '',
    };
  },
  methods: {
    value() {
      if (this.options.inputType == 'number') {
        return parseInt(this.internalValue, 10);
      }
      return this.internalValue;
    },
    reset() {
      this.internalValue = '';
    },
  },
};
</script>

<style scoped></style>
