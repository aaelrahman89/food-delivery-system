export default {
  methods: {
    notify(type, message, options = {}) {
      this.$root.$emit('notify', { type, message, options });
    },
  },
};
