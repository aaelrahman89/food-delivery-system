<template>
  <v-dialog v-model="open" width="320px">
    <template #activator="{ on }">
      <v-text-field
        :value="formattedValue"
        v-bind="$attrs"
        readonly
        :outlined="outlined"
        type="text"
        :style="style"
        @click:clear="clearValue"
        v-on="on"
      />
    </template>
    <v-card>
      <v-container>
        <v-row>
          <v-col class="pa-0">
            <v-toolbar color="white" tabs>
              <v-tabs
                v-model="activeTab"
                centered
                grow
                background-color="primary"
                slider-color="white"
              >
                <v-tab href="#date-picker">
                  <v-icon color="white">mdi-calendar</v-icon>
                </v-tab>
                <v-tab href="#time-picker">
                  <v-icon color="white">mdi-clock</v-icon>
                </v-tab>
              </v-tabs>
            </v-toolbar>
            <v-tabs-items v-model="activeTab">
              <v-tab-item value="date-picker">
                <v-date-picker
                  v-model="date"
                  class="elevation-0"
                  full-width
                  header-color="primary lighten-2"
                  color="primary"
                ></v-date-picker>
              </v-tab-item>
              <v-tab-item value="time-picker">
                <v-time-picker
                  v-model="time"
                  class="elevation-0"
                  full-width
                  header-color="primary lighten-2"
                  color="primary"
                ></v-time-picker>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pa-1">
            <v-btn text color="primary" @click="canceled">
              {{ $t('CANCEL') }}
            </v-btn>
            <v-btn text color="primary" @click="saved">{{ $t('OK') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { Datetime, currentDate, parseDate } from '../../core/utils/datetime';

export default {
  name: 'VgDatetimePickerLocal',
  props: {
    value: {
      type: String,
      default: null,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      date: undefined,
      time: undefined,
      open: false,
      activeTab: 'date-picker',
    };
  },
  computed: {
    formattedValue() {
      if (!this.value) {
        return undefined;
      }
      return new Datetime(this.value).toDatetimeDeprecated();
    },
    formattedInternalValue() {
      if (!this.internalValue) {
        return undefined;
      }
      return this.internalValue.toDatetimeDeprecated();
    },
    internalValue() {
      if (!this.date || !this.time) {
        return undefined;
      }
      return new Datetime(`${this.date} ${this.time}`);
    },
    style() {
      return {
        maxWidth: '240px',
        width: '240px',
      };
    },
  },
  watch: {
    open(value) {
      if (value) {
        this.init();
      }
    },
  },

  methods: {
    init() {
      this.activeTab = 'date-picker';
      if (this.value) {
        const date = parseDate(this.value);
        this.date = date.toISODate();
        this.time = `${date.getHours()}:${date.getMinutes()}`;
      } else {
        const date = currentDate();
        this.date = date.toISODate();
        this.time = '06:00';
      }
    },
    canceled() {
      this.close();
    },
    saved() {
      this.$emit('input', this.internalValue.toISOString());
      this.close();
    },
    clearValue() {
      this.$emit('input', undefined);
    },
    close() {
      this.open = false;
    },
  },
};
</script>

<style></style>
