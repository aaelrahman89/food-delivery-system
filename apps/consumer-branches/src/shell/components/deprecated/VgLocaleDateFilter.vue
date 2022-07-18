<template>
  <v-menu
    v-model="open"
    :close-on-content-click="false"
    lazy
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
  name: 'VgDateFilter',
  props: {
    value: {
      type: String,
      default: '',
    },
    dayBoundary: {
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
      if (value) {
        this.$emit(
          'input',
          this.createLocaleBoundary(value, this.dayBoundary).toISOString()
        );
      } else {
        this.$emit('input');
      }
    },
    value: {
      handler: function valueWatcher(value) {
        if (value) {
          const date = this.createLocaleBoundary(value);
          [this.date] = date.toISOString().split('T');
        } else {
          this.date = '';
        }
      },
      immediate: true,
    },
  },
  methods: {
    dateSelected() {
      this.open = false;
      this.$refs.input.focus();
    },
    createLocaleBoundary(value, dayBoundary) {
      let date = new Date(value);
      if (dayBoundary == 'start') {
        date.setHours(0, 0, 0, 0);
      } else if (dayBoundary == 'end') {
        date.setHours(23, 59, 59, 999);
      } else {
        date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      }
      return date;
    },
  },
};
</script>

<style scoped></style>
