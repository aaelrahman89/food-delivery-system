<template>
  <v-row justify="start" align="center">
    <v-col :class="layout.filter" class="grow">
      <v-row justify="start" align="center">
        <template v-for="filter in filters">
          <v-col :key="filter.name" :class="layout.components" cols="12">
            <div
              :id="filter.name"
              :key="`${filter.type}-container`"
              :data-test="`filter-${filter.name}`"
            >
              <component
                :is="`${filter.type}-filter`"
                :ref="filter.name"
                :name="filter.name"
                :title="filter.title"
                :options="filter.options"
              />
            </div>
          </v-col>
        </template>
      </v-row>
    </v-col>
    <v-col :class="layout.actions" cols="auto">
      <v-btn
        data-test="button-apply-filter"
        color="success"
        dark
        @click="submitForm"
      >
        {{ $t('misc.apply_lbl') }}
      </v-btn>
      <v-btn
        data-test="button-reset-filter"
        color="primary"
        dark
        @click="resetForm"
      >
        {{ $t('misc.reset_filters_lbl') }}
      </v-btn>
      <template v-for="action in customActions">
        <v-btn
          :key="action.text"
          :color="action.color"
          :dark="action.dark"
          :ripple="false"
          :data-test="`custom-action-${action.text}`"
          @click="action.onClick"
        >
          <v-icon v-if="action.icon">
            {{ action.icon }}
          </v-icon>
          {{ action.text }}
        </v-btn>
      </template>
    </v-col>
  </v-row>
</template>

<script>
import LookupFilter from './VgLookup.vue';
import StringFilter from './VgInput.vue';
import VgDatePickerFilter from './VgDatePickerFilter.vue';

export default {
  name: 'VgFilterMenu',
  components: {
    LookupFilter,
    StringFilter,
    VgDatePickerFilter,
  },
  props: {
    filters: {
      type: Array,
      default() {
        return [];
      },
    },
    customActions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    layout() {
      const containerSize = {
        components: { sm6: true },
      };
      const containerColumns = 12;
      let maxFilterColumns;
      let filterColumnWidth;

      if (this.customActions.length == 0) {
        containerSize.filters = { lg9: true };
        containerSize.actions = { lg3: true };
        maxFilterColumns = 4;
      } else {
        containerSize.filters = { lg7: true };
        containerSize.actions = { lg5: true };
        maxFilterColumns = 3;
      }

      if (this.filters.length > 0 && this.filters.length <= maxFilterColumns) {
        filterColumnWidth = Math.floor(containerColumns / this.filters.length);
      } else {
        filterColumnWidth = Math.floor(containerColumns / maxFilterColumns);
      }
      containerSize.components[`lg${filterColumnWidth}`] = true;

      return containerSize;
    },
  },
  methods: {
    submitForm() {
      const values = {};
      Object.entries(this.$refs).forEach((obj) => {
        obj.reduce((accum, item) => {
          const [ctrl] = item;
          if (ctrl.value()) {
            values[ctrl.name] = ctrl.value();
          }
          return accum;
        });
      });
      this.$emit('apply', values);
    },
    resetForm() {
      Object.entries(this.$refs).forEach((item) => {
        const [, [ctrl]] = item;
        ctrl.reset();
      });
      this.$emit('reset');
    },
  },
};
</script>

<style scoped></style>
