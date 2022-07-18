export default {
  watch: {
    'pm.loading': function progressWatcher() {
      if (this.pm.loading) {
        this._startProgress();
      } else {
        this._endProgress();
      }
    },
  },
  methods: {
    _startProgress() {
      this.$root.$emit('loadingProgress', true);
    },
    _endProgress() {
      this.$root.$emit('loadingProgress', false);
    },
  },
};
