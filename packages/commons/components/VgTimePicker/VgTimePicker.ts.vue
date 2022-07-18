<template>
  <v-dialog
    v-show="false"
    v-model="open"
    persistent
    lazy
    full-width
    max-width="300"
  >
    <template v-slot:activator="{ on }">
      <div class="vg-time-picker">
        <v-text-field
          ref="input"
          readonly
          :value="value.toString()"
          :label="computedLabel"
          :rules="validationRules"
          :outlined="outlined"
          color="primary"
          v-on="on"
        >
          <template #append>
            <svg
              class="time-icon"
              enable-background="new 0 0 443.294 443.294"
              height="512"
              viewBox="0 0 443.294 443.294"
              width="512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m221.647 0c-122.214 0-221.647 99.433-221.647 221.647s99.433 221.647 221.647 221.647 221.647-99.433 221.647-221.647-99.433-221.647-221.647-221.647zm0 415.588c-106.941 0-193.941-87-193.941-193.941s87-193.941 193.941-193.941 193.941 87 193.941 193.941-87 193.941-193.941 193.941z"
              />
              <path
                d="m235.5 83.118h-27.706v144.265l87.176 87.176 19.589-19.589-79.059-79.059z"
              />
            </svg>
          </template>
        </v-text-field>
      </div>
    </template>
    <v-time-picker
      v-model="time"
      class="elevation-0"
      full-width
      header-color="primary lighten-2"
      color="primary"
    >
      <vg-flex gap-size="tiny" justify-content="flex-end">
        <div>
          <v-btn text color="primary" @click="cancel">
            {{ $t('CANCEL') }}
          </v-btn>
        </div>
        <div>
          <v-btn text color="primary" @click="save">{{ $t('OK') }}</v-btn>
        </div>
      </vg-flex>
    </v-time-picker>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Time } from '../../core/models/Time';
import { VgFlex } from '../VgFlex';

const events = {
  input: 'input',
};

export default Vue.extend({
  name: 'VgTimePicker',
  components: { VgFlex },
  props: {
    value: {
      type: Time,
      required: true,
    },
    outlined: {
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
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      time: undefined as Date | undefined | string,
      open: false,
    };
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
  watch: {
    open(opened): void {
      if (opened && this.value) {
        this.time = new Date(`2000-01-01 ${this.value.toLocalTime()}`);
      }
    },
  },
  methods: {
    save(): void {
      this.$emit(events.input, Time.fromLocaleTime(this.time as string));
      this.open = false;
    },

    cancel(): void {
      this.open = false;
    },
  },
});
</script>

<style scoped>
.time-icon {
  height: 24px;
  width: 24px;
  fill: rgba(0, 0, 0, 0.38);
}
.vg-time-picker {
  max-width: 240px;
}
</style>
