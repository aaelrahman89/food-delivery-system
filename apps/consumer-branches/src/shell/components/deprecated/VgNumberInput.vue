<template>
  <v-row align="center">
    <v-col class="text-center" cols="5">
      <v-btn
        :disabled="isMin"
        :dark="!isMin"
        color="error"
        data-test="button-decrease-requests"
        @click="decrease"
      >
        <v-icon>fa-minus</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="2" class="text-h5 text-center">
      <div data-test="text-pilot-number">
        {{ value }}
      </div>
    </v-col>
    <v-col class="text-center" cols="5">
      <v-btn
        :disabled="isMax"
        :dark="!isMax"
        color="blue"
        data-test="button-increase-requests"
        @click="increase"
      >
        <v-icon>fa-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: '',
    },
    min: {
      type: [Number, String],
      default: null,
    },
    max: {
      type: [Number, String],
      default: null,
    },
  },
  computed: {
    isMax() {
      if (this.max != null) {
        return Number(this.value) === Number(this.max);
      }
      return false;
    },
    isMin() {
      if (this.min != null) {
        return Number(this.value) === Number(this.min);
      }
      return false;
    },
  },
  methods: {
    increase() {
      if (this.max != null) {
        if (this.value < this.max) {
          this.$emit('input', Number(this.value) + 1);
        }
      } else {
        this.$emit('input', Number(this.value) + 1);
      }
    },
    decrease() {
      if (this.min != null) {
        if (this.value > this.min) {
          this.$emit('input', Number(this.value) - 1);
        }
      } else {
        this.$emit('input', Number(this.value) - 1);
      }
    },
  },
};
</script>

<style scoped></style>
