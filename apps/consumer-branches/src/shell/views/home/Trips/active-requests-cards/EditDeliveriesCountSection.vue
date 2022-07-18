<template>
  <v-row align="center">
    <v-col class="mb-4" cols="12">
      <h3>
        {{ $t('pilots.requests_list.number_of_tasks') }}
      </h3>
    </v-col>
    <v-col class="mb-4" cols="12">
      <vg-number-input
        :value="value"
        :min="1"
        :max="maxAllowedDeliveriesCount"
        @input="$emit('input', $event)"
      />
    </v-col>
    <v-col class="mb-4" cols="12">
      <v-row>
        <v-col class="text-center" cols="6">
          <v-btn
            text
            color="error"
            data-test="cancel-edit"
            @click="$emit('canceled')"
          >
            {{ $t('misc.cancel') }}
          </v-btn>
        </v-col>
        <v-col class="text-center" cols="6">
          <v-btn
            color="success"
            dark
            data-test="confirm-edit"
            @click="$emit('confirmed')"
          >
            {{ $t('misc.confirm') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import VgNumberInput from '../../../../components/deprecated/VgNumberInput.vue';

export default {
  name: 'EditDeliveriesCountSection',
  components: { VgNumberInput },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    maxAllowedDeliveriesCount: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped></style>
