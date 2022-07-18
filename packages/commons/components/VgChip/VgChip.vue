<template>
  <div class="chip-container">
    <img v-if="img" class="chip-container__icon" :src="img" />
    <div class="chip-container__content">
      <slot> </slot>
    </div>
    <template v-if="cancelable">
      <svg
        class="chip-container__close-icon vg-clickable"
        width="15px"
        height="15px"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        style="enable-background: new 0 0 512 512"
        xml:space="preserve"
        @click="cancel"
      >
        <g>
          <g>
            <path
              d="M256,0C114.844,0,0,114.844,0,256s114.844,256,256,256s256-114.844,256-256S397.156,0,256,0z M359.54,329.374
			c4.167,4.165,4.167,10.919,0,15.085L344.46,359.54c-4.167,4.165-10.919,4.165-15.086,0L256,286.167l-73.374,73.374
			c-4.167,4.165-10.919,4.165-15.086,0l-15.081-15.082c-4.167-4.165-4.167-10.919,0-15.085l73.374-73.375l-73.374-73.374
			c-4.167-4.165-4.167-10.919,0-15.085l15.081-15.082c4.167-4.165,10.919-4.165,15.086,0L256,225.832l73.374-73.374
			c4.167-4.165,10.919-4.165,15.086,0l15.081,15.082c4.167,4.165,4.167,10.919,0,15.085l-73.374,73.374L359.54,329.374z"
            />
          </g>
        </g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
      </svg>
    </template>
  </div>
</template>

<script>
const events = {
  cancel: 'cancel',
};
export default {
  name: 'VgChip',
  props: {
    img: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    cancelable() {
      return this.$listeners.cancel;
    },
  },
  methods: {
    cancel() {
      this.$emit(events.cancel);
    },
  },
};
</script>

<style scoped lang="scss">
.chip-container {
  border-radius: 4px;
  background-color: #e4e4e4;
  height: 32px;
  min-width: 70px;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.chip-container__icon {
  margin-inline-start: var(--inset-tiny);
  width: 24px;
  height: 24px;
  border-radius: 12px;
}

.chip-container__content {
  margin-inline-start: var(--inset-small);
  margin-inline-end: var(--inset-small);
}

.chip-container__close-icon {
  margin-inline-end: var(--inset-small);
  fill: rgba(0, 0, 0, 0.54);
}
</style>
