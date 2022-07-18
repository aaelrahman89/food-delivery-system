export default {
  name: 'BaseFilterComponent',
  props: {
    inputFields: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
  },
  data() {
    return { filter: {} };
  },
  created() {
    try {
      const parsedFilter = JSON.parse(this.$route.query.filter);
      this.inputFields.forEach((field) => {
        this.filter[field] = parsedFilter[field];
      });
    } catch (err) {}
  },
  methods: {
    applyFilter() {
      const validFilterKeys = Object.keys(this.filter)
        .filter(
          (key) => this.filter[key] != null && this.filter[key].toString() != ''
        )
        .filter((key) => this.inputFields.includes(key));

      if (validFilterKeys.length) {
        const appliedFilter = {};

        validFilterKeys.forEach((key) => {
          appliedFilter[key] = this.filter[key];
        });

        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            filter: JSON.stringify(appliedFilter),
          },
        });
      } else {
        this.resetFilter();
      }
    },
    resetFilter() {
      const query = { ...this.$route.query };
      delete query.filter;
      this.filter = {};
      this.$router.push({
        query,
        name: this.$route.name,
      });
    },
  },
};
