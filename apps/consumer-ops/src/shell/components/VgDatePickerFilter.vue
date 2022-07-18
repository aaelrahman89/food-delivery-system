<template>
  <v-row>
    <!--FROM-->
    <v-col>
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :close-on-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template #activator="{ on }">
          <v-text-field
            v-model="currentRange"
            :label="title"
            readonly
            v-on="on"
          />
        </template>
        <v-card>
          <v-card-text class="pa-0">
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-date-picker
                      v-model="currentFromDate"
                      :reactive="true"
                      scrollable
                      color="green lighten-1"
                      class="elevation-1"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-date-picker
                      v-model="currentToDate"
                      :reactive="true"
                      scrollable
                      color="blue lighten-1"
                      class="elevation-1"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="text-center" cols="12">
                <v-btn color="primary" @click="$refs.menu.save()">
                  {{ $t('misc.confirm_lbl') }}
                </v-btn>
                <v-btn color="primary" @click="reset()">
                  {{ $t('misc.clear_lbl') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import date from 'date-and-time';

export default {
  name: 'VgDatePickerFilter',
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      currentFromDate: '',
      currentToDate: '',
      menu: false,
    };
  },
  computed: {
    currentRange() {
      if (this.currentFromDate !== '' && this.currentToDate !== '') {
        return `${this.formatDate(this.currentFromDate)}, ${this.formatDate(
          this.currentToDate
        )}`;
      }

      if (this.currentFromDate === '' && this.currentToDate !== '') {
        return `${this.$t('misc.to_date_lbl')}: ${this.formatDate(
          this.currentToDate
        )}`;
      }

      if (this.currentFromDate !== '' && this.currentToDate === '') {
        return `${this.$t('misc.from_date_lbl')}: ${this.formatDate(
          this.currentFromDate
        )}`;
      }

      return '';
    },
  },
  methods: {
    value() {
      const dateRange = {};
      if (this.currentRange === '') {
        return '';
      }
      if (this.currentToDate) {
        const toDate = new Date(this.currentToDate);
        toDate.setHours(23, 59, 59);
        dateRange.to = toDate.toISOString();
      }
      // from only
      if (this.currentFromDate) {
        const fromDate = new Date(this.currentFromDate);
        fromDate.setHours(0, 0, 0);
        dateRange.from = fromDate.toISOString();
      }
      return dateRange;
    },
    reset() {
      this.currentFromDate = '';
      this.currentToDate = '';
    },
    formatDate(value) {
      if (!value) {
        return '';
      }
      const defaultFormat = '\u200EYYYY-MM-DD';
      return date.format(new Date(value), defaultFormat);
    },
  },
};
</script>

<style scoped></style>
