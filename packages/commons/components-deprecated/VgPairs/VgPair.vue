<template>
  <div class="pair-container" :class="{ dark: dark }">
    <div class="key">
      {{ pair.key }}
    </div>
    <bdi class="value">
      {{ pair.value }}
    </bdi>
  </div>
</template>

<script>
export default {
  name: 'VgPair',
  props: {
    pair: {
      type: Object,
      default() {
        return {};
      },
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.pair-container {
  margin-inline-start: var(--inset-small);
  margin-top: var(--inset-small);
  @media (max-width: 600px) {
    max-width: initial;
  }
  padding: var(--inset-small);

  display: flex;
  flex-direction: row;
  align-items: flex-start;

  background-color: var(--color-surface-light);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;

  .key {
    margin-inline-end: var(--inset-mid);

    white-space: nowrap;
    display: block;

    color: var(--color-primary);
    font-size: 14px;
    line-height: 18px;
    text-align: start;
  }

  .value {
    color: var(--color-on-surface-high-emphasis);
    font-size: 14px;
    line-height: 18px;
    text-align: end;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    .value {
      margin-top: var(--inset-mid);
      text-align: start;
    }
  }
}

.dark {
  background-color: var(--color-surface-dark);
}
</style>
