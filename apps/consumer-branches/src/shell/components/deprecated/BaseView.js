export default {
  name: 'BaseView',
  watch: {
    'pm.loading': function loadProgress(newValue) {
      if (newValue) this.__startProgress();
      else this.__endProgress();
    },
    'pm.notification': function watchNotification(newValue) {
      if (newValue) this.__emitNotification(newValue);
    },
  },
  methods: {
    __startProgress() {
      this.$root.$emit('loadingProgress', true);
    },
    __endProgress() {
      this.$root.$emit('loadingProgress', false);
    },
    __emitNotification({ type, message, params }) {
      this.$root.$emit('notification', { type, message, params });
    },
  },
};
