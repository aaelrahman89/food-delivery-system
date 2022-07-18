export default {
  name: 'VgString',
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  render(createElement) {
    const string = this.value[this.$currentLocale];

    if (!string && this.$currentLocale == 'ar') {
      return createElement('span', this.value.en);
    }
    if (!string && this.$currentLocale == 'en') {
      return createElement('span', this.value.ar);
    }

    return createElement('span', string);
  },
};
