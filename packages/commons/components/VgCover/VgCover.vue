<template>
  <div class="vg-cover">
    <div class="vg-cover__img">
      <slot></slot>
    </div>
    <div class="vg-cover__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VgCover',
};
</script>

<style scoped lang="scss">
.vg-cover {
  width: 100%;
  padding: var(--inset-mid);

  display: flex;
  flex-direction: row;

  background-color: var(--color-surface-light);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
}

.vg-cover__img {
  width: 140px;
  height: 140px;
}

.vg-cover__img img {
  height: 140px;
  width: 140px;
  border-radius: 4px;
  object-fit: cover;
}

.vg-cover__content {
  flex-grow: 1;
  margin-inline-start: var(--inset-mid);
}

.vg-cover--dark {
  background-color: var(--color-surface-dark);
}
</style>
