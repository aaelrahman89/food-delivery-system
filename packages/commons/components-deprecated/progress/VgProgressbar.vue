<template>
  <div class="progress-container">
    <div ref="rail" class="progress-value-container">
      <div
        class="directional-wrapper"
        :style="{ 'margin-inline-start': computedProgress + 'px' }"
      >
        <div class="progress-value">
          {{ Math.round(progress * 100) + ' %' }}
        </div>
      </div>
    </div>
    <div class="progress">
      <div class="progress-range"></div>
      <div
        class="progress-bar"
        :style="{ width: 'calc(100% * ' + progress + ')' }"
      ></div>
    </div>
    <div class="numbers">
      <div class="range-start">
        {{ min }}
      </div>
      <div class="range-end">
        {{ max }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VgProgressbar',
  props: {
    min: {
      type: [Number, String, Object],
      default: 0,
    },
    max: {
      type: [Number, String, Object],
      default: 0,
    },
    value: {
      type: [Number, String, Object],
      default: 0,
    },
  },
  data() {
    return {
      isMounted: false,
    };
  },
  computed: {
    progress() {
      return this.normalize(this.value, this.min, this.max);
    },
    computedProgress() {
      if (this.isMounted) {
        const width = this.$refs.rail.offsetWidth;
        const darftProgress = this.progress * width;

        if (darftProgress > width - 30) {
          return width - 30;
        }

        if (darftProgress < 30) return 30;
        return darftProgress;
      }
      return 0;
    },
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    normalize(value, minValue, limitDelta) {
      const result = (value - minValue) / limitDelta;
      if (result > 1) return 1;
      if (result < 0) return 0;
      return result;
    },
  },
};
</script>

<style scoped lang="scss">
.progress-container {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  .progress-value-container {
    margin-bottom: 10px;

    .directional-wrapper {
      height: 24px;

      display: flex;
      justify-content: center;
      align-items: center;

      position: relative;

      .progress-value {
        height: 100%;
        width: 60px;

        padding: 0 8px;
        margin-inline-start: -50%;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;

        background: var(--color-primary);
        border-radius: 4px;

        color: var(--color-surface-light);
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
        white-space: nowrap;
      }
    }
  }

  .progress {
    height: 100%;

    flex-grow: 1;

    display: flex;
    align-items: center;
    justify-content: flex-start;

    position: relative;

    .progress-range {
      height: 8px;
      width: 100%;

      border-radius: 4px;
      background-color: var(--color-border-light);
    }

    .progress-bar {
      height: 8px;

      position: absolute;

      border-radius: 4px;
      background-color: var(--color-primary);
    }
  }

  .numbers {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .range-start,
    .range-end {
      margin-top: 10px;

      font-size: 20px;
      color: var(--color-on-surface-high-emphasis);
    }
  }
}
</style>
