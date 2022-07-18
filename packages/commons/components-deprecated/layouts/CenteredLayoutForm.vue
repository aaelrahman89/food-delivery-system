<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-form ref="form" v-bind="$attrs" v-on="$listeners">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="text-capitalize">
              <slot name="title"> </slot>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <slot name="body"></slot>
          </v-card-text>
          <v-card-actions>
            <language-menu text></language-menu>
            <div class="flex-grow-1"></div>
            <slot name="actions"></slot>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import LanguageMenu from '../menus/LanguageMenu.vue';

export default {
  name: 'CenteredLayoutForm',
  components: { LanguageMenu },
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>
