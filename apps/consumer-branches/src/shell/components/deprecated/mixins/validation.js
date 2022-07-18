export default {
  methods: {
    validate(field) {
      const validation = this.pm.validators()[field]();
      return validation === true ? true : this.$t(validation);
    },
  },
};
