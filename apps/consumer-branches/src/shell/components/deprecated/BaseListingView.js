import BaseView from './BaseView';

export default {
  name: 'BaseListingView',
  extends: BaseView,
  watch: {
    '$route.query': async function queryChanged() {
      await this.pm.onQueryChange(this.parseRouteQuery());
    },
  },

  methods: {
    parseRouteQuery() {
      const parsedQuery = {};
      Object.entries(this.$route.query).forEach(([key, value]) => {
        try {
          parsedQuery[key] = JSON.parse(value);
        } catch (err) {
          parsedQuery[key] = value;
        }
      });
      return parsedQuery;
    },
  },
};
