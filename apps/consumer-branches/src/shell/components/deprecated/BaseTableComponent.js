export default {
  name: 'BaseTable',
  props: {
    skip: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 25,
    },
    sort: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    pagination() {
      const vuetifyPagination = {
        rowsPerPage: this.limit,
        page: parseInt(this.skip / this.limit, 10) + 1,
      };
      const sortFields = Object.entries(this.sort);
      if (sortFields.length == 1) {
        const [[key, order]] = sortFields;
        vuetifyPagination.sortBy = key;
        vuetifyPagination.descending = order.toLowerCase() == 'desc';
      }

      return vuetifyPagination;
    },
  },
  methods: {
    paginationUpdated({ rowsPerPage, page, sortBy, descending }) {
      const pagination = {
        limit: rowsPerPage,
        skip: rowsPerPage * (page - 1),
      };
      if (sortBy) {
        pagination.sort = JSON.stringify({
          [sortBy]: descending ? 'desc' : 'asc',
        });
      }

      this.$router.push({
        name: this.$route.name,
        query: {
          ...this.$route.query,
          ...pagination,
        },
      });
    },
  },
};
