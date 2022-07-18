<template>
  <v-dialog
    :value="open"
    :fullscreen="fullscreen"
    :hide-overlay="hideOverlay"
    :persistent="persistent"
    :max-width="maxWidth"
    transition="dialog-bottom-transition"
    @update:returnValue="$emit('close')"
  >
    <v-card>
      <v-toolbar ref="toolbar" dark color="vg-darkgrey">
        <v-toolbar-title>
          <slot name="title" />
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon dark @click="$emit('close')">
          <v-icon>fa-times</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row class="fill-height">
          <v-col cols="12">
            <slot />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'VgModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: true,
    },
    hideOverlay: {
      type: Boolean,
      default: true,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: '',
    },
    lazy: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
