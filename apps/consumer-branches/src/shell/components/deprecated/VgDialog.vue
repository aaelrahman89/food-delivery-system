<template>
  <v-dialog
    :value="open"
    :max-width="maxWidth"
    :persistent="persistent"
    :fullscreen="fullScreen"
    scrollable
    full-width
    @input="$emit('update:open', $event)"
  >
    <v-card class="confirmation-dialog">
      <v-card-title>
        <v-row>
          <v-col class="grow">
            <slot name="title"></slot>
          </v-col>
          <v-col class="shrink">
            <v-icon :disabled="loading" @click="onClose">fa-times</v-icon>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container class="pa-0">
          <slot></slot>
        </v-container>
      </v-card-text>
      <v-card-actions v-if="!noActions">
        <slot name="actions">
          <v-row class="mb-3" justify="end">
            <v-btn text color="error" :disabled="loading" @click="onCancel">
              {{ $t(cancellationLabel) }}
            </v-btn>
            <v-btn
              text
              color="success"
              :disabled="disableApply"
              :loading="loading"
              @click="onApply"
            >
              {{ $t(confirmationLabel) }}
            </v-btn>
          </v-row>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'VgDialog',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: '500',
    },
    cancellationLabel: {
      type: String,
      default: 'CANCEL',
    },
    confirmationLabel: {
      type: String,
      default: 'APPLY',
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    fullScreen: {
      type: Boolean,
      default: false,
    },
    noActions: {
      type: Boolean,
      default: false,
    },
    canApply: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    disableApply() {
      return this.loading || !this.canApply;
    },
  },
  watch: {
    open(newValue) {
      if (newValue === true) {
        this.$emit('open');
      }
    },
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
      this.$emit('update:open', false);
    },
    onApply() {
      this.$emit('apply');
    },
    onClose() {
      this.$emit('update:open', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.confirmation-dialog {
  overflow-y: hidden;
}
</style>
