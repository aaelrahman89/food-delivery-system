<template>
  <v-snackbar
    :color="type"
    :right="!$data.$rtl"
    :left="$data.$rtl"
    :top="$vuetify.breakpoint.smAndUp"
    :bottom="$vuetify.breakpoint.xsOnly"
    multi-line
    :value="visible"
    :timeout="4000"
  >
    <div class="notification-body">
      <div>
        {{ $t(code, args) }}
      </div>
      <div>
        <v-btn dark text @click="hide">
          {{ $t('CLOSE') }}
        </v-btn>
      </div>
    </div>
  </v-snackbar>
</template>

<script>
import { VBtn } from 'vuetify/lib/components/VBtn';
import { VSnackbar } from 'vuetify/lib/components/VSnackbar';

export default {
  name: 'VgToast',
  components: {
    VSnackbar,
    VBtn,
  },
  props: {
    value: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      visible: false,
      code: undefined,
      type: undefined,
      args: undefined,
    };
  },
  watch: {
    value(newValue) {
      this.notify(newValue);
    },
  },
  methods: {
    hide() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    },
    async notify({ code, type, args }) {
      this.code = code;
      this.type = type;
      this.args = args;
      this.hide();
      await this.$nextTick();
      this.show();
    },
  },
};
</script>

<style lang="scss" scoped>
.notification-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
