<template>
  <v-menu
    v-model="open"
    :close-on-content-click="false"
    lazy
    data-test="date-picker"
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field ref="input" v-model="date" v-bind="$attrs" v-on="on" />
    </template>
    <v-date-picker v-model="date" color="primary" @input="dateSelected" />
  </v-menu>
</template>

<script>
export default {
  name: 'VgDatePicker',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      open: false,
      date: '',
    };
  },
  watch: {
    date(value) {
      this.$emit('input', value);
    },
  },
  mounted() {
    this.date = this.value;
  },
  methods: {
    dateSelected() {
      this.open = false;
      this.$refs.input.focus();
    },
  },
};
</script>

<style scoped></style>
