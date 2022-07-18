<template>
  <v-row>
    <v-col class="grow">
      <v-btn
        color="error"
        block
        text
        data-test="button-cancel-request"
        :disabled="!canCancel"
        @click="$emit('cancel-trip')"
      >
        {{ $t('pilots.requests_list.cancel') }}
      </v-btn>
    </v-col>
    <v-col class="grow">
      <v-btn
        color="blue"
        text
        block
        :disabled="!canEdit"
        @click="$emit('edit-deliveries-count')"
      >
        {{ $t('pilots.requests_list.edit_tasks_per_trip') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ActionsSection',
  props: {
    canCancel: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>
