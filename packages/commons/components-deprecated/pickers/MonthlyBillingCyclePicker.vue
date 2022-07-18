<template>
  <v-autocomplete
    :value="value"
    v-bind="$attrs"
    :items="billingCycles"
    item-text="text"
    item-value="value"
    hide-details
    @input="updateValue"
    v-on="$listeners"
  >
    <template #item="{ item }">
      <template v-if="item.disabled">
        <v-divider></v-divider>
        <v-subheader>{{ item.text }}</v-subheader>
        <v-divider></v-divider>
      </template>
      <template v-else>
        <v-row>
          <v-col>
            <span class="font-weight-bold">
              {{ $t(monthNames[item.value.month - 1]) }}
            </span>
          </v-col>
          <v-col>
            {{ item.text }}
          </v-col>
        </v-row>
      </template>
    </template>
    <template #selection="{ item }">
      <bdi>{{ $t(monthNames[item.value.month - 1]) }}: {{ item.text }}</bdi>
    </template>
  </v-autocomplete>
</template>

<script>
import { MonthlyBillingCycle } from '../../core/models/MonthlyBillingCycle';

export default {
  name: 'MonthlyBillingCyclePicker',
  props: {
    value: {
      type: MonthlyBillingCycle,
      default: undefined,
    },
    min: {
      type: MonthlyBillingCycle,
      default() {
        return new MonthlyBillingCycle({ year: 2019, month: 11 });
      },
    },
    max: {
      type: MonthlyBillingCycle,
      default() {
        const currentDate = new Date();

        return new MonthlyBillingCycle({
          year: currentDate.getFullYear() + 2,
          month: currentDate.getMonth() + 1,
        });
      },
    },
  },
  data() {
    return {
      events: {
        input: 'input',
        update: 'update',
      },
      monthNames: [
        'JANUARY',
        'FEBRUARY',
        'MARCH',
        'APRIL',
        'MAY',
        'JUNE',
        'JULY',
        'AUGUST',
        'SEPTEMBER',
        'OCTOBER',
        'NOVEMBER',
        'DECEMBER',
      ],
    };
  },
  computed: {
    billingCycles() {
      let { month, year } = this.min;
      const monthsCount = this.monthDiff(this.min.startDate, this.max.endDate);
      const billingCycles = [
        {
          value: undefined,
          text: year,
          disabled: true,
        },
      ];
      for (let i = 0; i < monthsCount; i += 1) {
        if (month === 13) {
          year += 1;
          month = 1;
          billingCycles.push({
            value: undefined,
            text: year,
            disabled: true,
          });
        }
        const billingCycle = new MonthlyBillingCycle({ month, year });
        billingCycles.push({
          value: billingCycle,
          text: billingCycle.toString(),
          disabled: false,
        });
        month += 1;
      }

      return billingCycles;
    },
  },
  methods: {
    monthDiff(d1, d2) {
      let months;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth();
      months += d2.getMonth();
      return months;
    },
    updateValue(billingCycle) {
      this.$emit(this.events.input, billingCycle);
      this.$emit(this.events.update, billingCycle);
    },
  },
};
</script>

<style scoped></style>
