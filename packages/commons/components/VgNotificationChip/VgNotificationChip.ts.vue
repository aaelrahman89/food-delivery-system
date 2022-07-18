<template>
  <div class="vg-notification-chip" :class="{ buzz: isBuzzing }">
    <div class="vg-notification-chip__icon">
      <slot name="icon"></slot>
    </div>
    <div class="vg-notification-chip__title">
      {{ title }}
    </div>
    <div class="vg-notification-chip__count-container">
      {{ count }}
      <div
        class="vg-notification-chip__count-container__ripple"
        :class="{ blink: shouldBlink }"
      ></div>
    </div>
    <audio
      v-if="sound"
      ref="player"
      crossorigin="anonymous"
      :src="sound.url"
    ></audio>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { AssetExport } from '@survv/assets';
import { PropValidator } from 'vue/types/options';

export default Vue.extend({
  name: 'VgNotificationChip',
  props: {
    title: {
      type: String,
      default: undefined,
    },
    sound: {
      type: Object,
      default: undefined,
    } as PropValidator<AssetExport>,
    count: {
      type: Number,
      default: undefined,
    },
    ripple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isBuzzing: false,
      buzzerTimerId: 0,
      player: new Audio(),
    };
  },
  computed: {
    shouldBlink(): boolean {
      return this.ripple && this.count > 0 && !this.isBuzzing;
    },
  },

  watch: {
    async count(newCount, oldCount): Promise<void> {
      let playingPromise: Promise<void> = Promise.resolve();
      if (newCount > oldCount) {
        if (!this.isBuzzing && this.ripple) {
          this.isBuzzing = true;

          if (this.player) {
            this.player.currentTime = 0;
            playingPromise = this.player.play();
          }

          this.buzzerTimerId = window.setTimeout(() => {
            this.isBuzzing = false;
          }, 2000);
        }
      }
      return playingPromise;
    },
  },
  mounted() {
    this.player = this.$refs.player as HTMLAudioElement;
  },

  destroyed(): void {
    window.clearInterval(this.buzzerTimerId);
  },
});
</script>

<style scoped lang="scss">
.vg-notification-chip {
  height: 40px;
  width: min-content;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  background-color: var(--color-surface-dark);
  border-radius: 8px;

  overflow: hidden;

  &__icon {
    height: 24px;

    margin-inline-start: calc(var(--inset-tiny) + var(--inset-small));

    fill: var(--color-primary);
  }

  &__title {
    padding: 0 var(--inset-small);

    font-size: 16px;
    font-weight: 500;
    word-wrap: normal;
    white-space: nowrap;

    @media (max-width: 1000px) {
      display: none;
    }
  }

  &__count-container {
    height: 24px;
    min-width: 24px;

    margin-inline-end: calc(var(--inset-tiny) + var(--inset-small));
    margin-inline-start: var(--inset-tiny);

    padding: 0 var(--inset-tiny);

    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    border-radius: 12px;
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    font-size: 14px;
    font-weight: 500;

    &__ripple {
      width: 0;
      height: 0;

      background-color: var(--color-primary);
      opacity: 0.15;
      border-radius: 50%;

      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.blink {
  animation: blink 1500ms cubic-bezier(0, 0.395, 0.58, 1) infinite alternate;
}

.buzz {
  animation: wiggle 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  border: 0px solid var(--color-primary);
}

@keyframes blink {
  from {
    width: 0px;
    height: 0px;
  }

  to {
    width: 400px;
    height: 400px;
  }
}

@keyframes wiggle {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
    border-width: 1px;
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
    border-width: 2px;
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
    border-width: 4px;
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
    border-width: 4px;
  }
}
</style>
