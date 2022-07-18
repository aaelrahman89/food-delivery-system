export default {
  watch: {
    'pm.notification': function notificationWatcher(value) {
      if (value) this._emitNotification(value);
    },
  },
  methods: {
    _emitNotification({ type, message, params }) {
      this.$root.$emit('notification', { type, message, params });
    },
  },
};
