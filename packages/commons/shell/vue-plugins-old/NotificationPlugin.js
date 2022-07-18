export const NotificationPlugin = {
  install(Vue) {
    Vue.mixin({
      methods: {
        notify(type, message) {
          this.$root.$emit('notify', { type, message });
        },
      },
    });
  },
};
