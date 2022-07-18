<template>
  <div class="text-center">
    <v-dialog
      width="500"
      :value="opened"
      @input="$emit('update:opened', $event)"
    >
      <v-card>
        <v-card-title class="text-h5 lighten-2" primary-title>
          {{ $t('STACKING_CONFIG_DIALOG_ERROR_HEADER') }}
        </v-card-title>

        <v-card-text>
          {{ $t('STACKING_CONFIG_DIALOG_ERROR_BODY') }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <vg-button @click="$emit('update:opened', false)">
            {{ $t('STACKING_CONFIG_DIALOG_DISMISS') }}
          </vg-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgButton } from '@survv/commons/components/VgButton';

export default Vue.extend({
  name: 'StackingConfigFormDialog',
  components: {
    VgButton,
  },
  props: {
    opened: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
